<?php
declare(strict_types=1);
require __DIR__ . '/common.php';
same_origin();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET','POST'],true)) {header('Allow: GET, POST');respond(405,['ok'=>false,'message'=>'Method not allowed.']);}
session_name('esbd_enquiry');
session_start(['cookie_httponly'=>true,'cookie_samesite'=>'Strict','cookie_secure'=>PHP_SAPI !== 'cli-server','use_strict_mode'=>true,'cookie_path'=>'/api/']);
if ($method === 'GET') {
    if (empty($_SESSION['token']) || time()-($_SESSION['issued']??0)>3600) {
        $_SESSION['token']=bin2hex(random_bytes(32)); $_SESSION['issued']=time();
    }
    respond(200,['token'=>$_SESSION['token']]);
}
$data=read_json();
if (!is_string($data['token']??null) || !hash_equals($_SESSION['token']??'', $data['token']) || time()-($_SESSION['issued']??0)>3600) respond(403,['ok'=>false,'message'=>'Your form session has expired. Please press send again.']);
foreach (['name','email','message','company','website'] as $key) {
    if (isset($data[$key]) && !is_string($data[$key])) respond(422,['ok'=>false,'message'=>'Please check your form fields.']);
}
if (!empty($data['website'])) respond(422,['ok'=>false,'message'=>'We could not process this enquiry. Please email info@esbd.co.za.']);
$name=trim($data['name']??'');$email=trim($data['email']??'');$message=trim($data['message']??'');
if (strlen($name)<2 || strlen($name)>120 || preg_match('/[\r\n\x00-\x1f]/',$name) || strlen($email)>254 || !filter_var($email,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/',$email) || strlen($message)<10 || strlen($message)>6000) respond(422,['ok'=>false,'message'=>'Enter your name, a valid email and a message between 10 and 6,000 characters.']);
foreach (['company'] as $key) if (strlen($data[$key]??'')>200) respond(422,['ok'=>false,'message'=>'One of your fields is too long.']);
// A locked hourly rate file limits sessions from the same address. Store keyed
// digests, never raw IPs or enquiry content. A fresh secret is used every hour.
$dir=private_dir(); $hour=gmdate('YmdH');$path=$dir.'/rate-'.$hour.'.json';
$fp=@fopen($path,'c+');
if (!$fp || !flock($fp,LOCK_EX)) {
    error_log('ESBD enquiry: unable to open or lock rate-limit storage.');
    respond(503,['ok'=>false,'code'=>'rate_storage_unavailable','message'=>'The form is temporarily unavailable (reference: storage lock). Please email info@esbd.co.za.']);
}
$state=json_decode(stream_get_contents($fp),true)?:['secret'=>bin2hex(random_bytes(32)),'counts'=>[],'total'=>0];
$key=hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',$state['secret']);
if (($state['counts'][$key]??0)>=5 || $state['total']>=100) {flock($fp,LOCK_UN);fclose($fp);respond(429,['ok'=>false,'message'=>'Too many enquiries were submitted recently. Please try later or email info@esbd.co.za.']);}
$state['counts'][$key]=($state['counts'][$key]??0)+1;$state['total']++;
rewind($fp);ftruncate($fp,0);fwrite($fp,json_encode($state));fflush($fp);flock($fp,LOCK_UN);fclose($fp);@chmod($path,0600);
foreach(glob($dir.'/rate-*.json')?:[] as $old) if(filemtime($old)<time()-7200) @unlink($old);
$body="New ESBD website enquiry\n\nName: $name\nEmail: $email\nCompany: ".($data['company']??'')."\n\n$message\n";
$headers=['From'=>'ESBD <info@esbd.co.za>','Reply-To'=>$email,'MIME-Version'=>'1.0','Content-Type'=>'text/plain; charset=UTF-8'];
// xneelo supports the Sendmail alias on Basic hosting and higher.
// Keep sender/recipient fixed: no user input is placed into shell parameters.
$sent=@mail('info@esbd.co.za','ESBD website enquiry',$body,$headers,'-finfo@esbd.co.za');
if (!$sent) {
    error_log('ESBD enquiry: hosting mail transport did not accept the message.');
    respond(503,['ok'=>false,'code'=>'mail_unavailable','message'=>'Your enquiry could not be sent (reference: mail delivery). Your details are still here. Please try again or email info@esbd.co.za.']);
}
unset($_SESSION['token'],$_SESSION['issued']);
respond(200,['ok'=>true,'message'=>'Your enquiry has been submitted. Thank you for getting in touch with ESBD.']);
