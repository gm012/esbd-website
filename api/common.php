<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(int $status, array $data): never {
    http_response_code($status); echo json_encode($data); exit;
}
function private_storage_path(string $siteRoot): string {
    $siteRoot = str_replace('\\', '/', $siteRoot);
    // Xneelo's public_html is a symlink to /usr/www/users/<account>.
    // Its parent is shared infrastructure, NOT the account's home directory.
    if (preg_match('~^/usr/wwws?/users/([A-Za-z0-9_-]+)(?:/|$)~', $siteRoot, $match)) {
        return '/usr/home/' . $match[1] . '/esbd-private';
    }
    return dirname($siteRoot) . '/esbd-private';
}
function private_dir(): string {
    $dir = private_storage_path(dirname(__DIR__));
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('ESBD private storage: unable to create account storage directory.');
        respond(503, ['ok'=>false,'code'=>'storage_unavailable','message'=>'The form is temporarily unavailable (reference: storage). Please email info@esbd.co.za.']);
    }
    if (!is_writable($dir)) {
        error_log('ESBD private storage: account storage directory is not writable.');
        respond(503, ['ok'=>false,'code'=>'storage_unavailable','message'=>'The form is temporarily unavailable (reference: storage). Please email info@esbd.co.za.']);
    }
    return $dir;
}
function same_origin(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = ['https://esbd.co.za','https://www.esbd.co.za'];
    if (PHP_SAPI === 'cli-server') $allowed[] = 'http://127.0.0.1:8891';
    if ($origin !== '' && !in_array($origin, $allowed, true)) respond(403,['ok'=>false,'message'=>'Please submit this form from the ESBD website.']);
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') respond(403,['ok'=>false,'message'=>'Request not allowed.']);
}
function read_json(): array {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16000) respond(413,['ok'=>false,'message'=>'Your message is too long.']);
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) respond(415,['ok'=>false,'message'=>'Unsupported request format.']);
    $raw = file_get_contents('php://input', false, null, 0, 16001);
    if ($raw === false || strlen($raw)>16000) respond(413,['ok'=>false,'message'=>'Your message is too long.']);
    $data = json_decode($raw, true);
    if (!is_array($data)) respond(400,['ok'=>false,'message'=>'Please check your form and try again.']);
    return $data;
}
