<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ERROR);
define('IMAGES_DIR', '../uploads');
require_once '../config/meekro_db.php';

function encryptIt($q)
{
    return md5($q);
}


##############################################
###Auth System
##############################################

function login_user($email, $encryptPassword)
{
    return  DB::queryFirstRow("select id, email,username from usr where email = %s and password = %s", $email, $encryptPassword);
}

##############################################
### User
##############################################
//
// function get_current_user($email)
// {
//     return  DB::queryFirstRow("select id, email,username from usr where email = %s", $email);
// }

##############################################
### Catgeory
##############################################

function save_category($category_title, $category_description, $inserted_by)
{
    DB::$error_handler = false; // since we're catching errors, don't need error handler
    DB::$throw_exception_on_error = true;
    try {
        return DB::insert('category', [
  'category_title' => $category_title,
  'category_description' => $category_description,
  'inserted_by' =>$inserted_by
]);
    } catch (MeekroDBException $e) {
        return $e->getMessage();
    }
    // restore default error handling behavior
    // don't throw any more exceptions, and die on errors
    DB::$error_handler = 'meekrodb_error_handler';
    DB::$throw_exception_on_error = false;
}

function get_categories()
{
    return  DB::query("SELECT id, category_title, category_description FROM category WHERE status = 'active' order by id desc");
}

function delete_category($category_id)
{
    $result  = DB::query("SELECT category_id from images Where category_id = %i", $category_id);
    if (sizeof($result) > 0) {
        return false;
    } else {
        return DB::update('category', ['status' => 'de_active'], "id=%i", $category_id);
    }
}

##############################################
### Images
##############################################
function get_dropdown_categories()
{
    return  DB::query("SELECT id, category_title FROM category WHERE status = 'active' order by id desc");
}


function crop_image($data)
{
    // Target siz
    $targ_w = $data['targ_w'];
    $targ_h = $data['targ_h'];
    // quality
    $jpeg_quality = 90;
    // photo path
    $src =$data['photo_url'];
    // create new jpeg image based on the target sizes
    $img_r = imagecreatefromjpeg($src);
    $dst_r = ImageCreateTrueColor($targ_w, $targ_h);
    // crop photo
    imagecopyresampled($dst_r, $img_r, 0, 0, $data['x'], $data['y'], $targ_w, $targ_h, $data['w'], $data['h']);
    // create the physical photo
    imagejpeg($dst_r, $src, $jpeg_quality);
    // display the  photo - "?time()" to force refresh by the browser
    return  '<img src="'.$src.'?'.time().'">';
}


function save_image($data)
{
    DB::$error_handler = false; // since we're catching errors, don't need error handler
    DB::$throw_exception_on_error = true;
    if (!is_dir(IMAGES_DIR)) {
        //Directory does not exist, so lets create it.
        mkdir(IMAGES_DIR, 0755, true);
    }
    if (!is_dir(IMAGES_DIR.'/'.$data['category_id'])) {
        //Directory does not exist, so lets create it.
        mkdir(IMAGES_DIR.'/'.$data['category_id'], 0755, true);
    }
    // if (is_dir(IMAGES_DIR.'/'.$data['category_id'])) {
    $dir_name= str_replace(" ", "", IMAGES_DIR.'/'.$data['image_dir']);
    $image_parts = explode(";base64,", $_POST['wallpaperBase64']);
    $image_type_aux = explode("image/", $image_parts[0]);
    $image_type = $image_type_aux[1];
    $image_base64 = base64_decode($image_parts[1]);
    if (file_put_contents($dir_name, $image_base64)) {
        try {
            return
 DB::insert('images', [
   'category_id' => $data['category_id'],
   'image_url' => $dir_name,
   'image_title' => $data['title'],
   'inserted_by' => $data['inserted_by']
 ]);
        } catch (MeekroDBException $e) {
            return $e->getMessage();
        }
    } else {
        return false;
    }
    // restore default error handling behavior
    // don't throw any more exceptions, and die on errors
    DB::$error_handler = 'meekrodb_error_handler';
    DB::$throw_exception_on_error = false;
}

##############################################
### Category Images
##############################################
function get_category_images($category_id)
{
    if (!is_dir(IMAGES_DIR.'/'.$category_id)) {
        //Directory does not exist, so lets create it.
        return false;
    }
    $data = DB::query("SELECT id, category_id, image_url, image_title from images where category_id = $category_id ORDER BY id DESC");

    return $data;
}
function delete_image($image_id)
{
    $imagePath = DB::query("SELECT image_url, category_id from images where id = %i", $image_id);
    $imageUrl = $imagePath[0]['image_url'];
    $category_id = $imagePath[0]['category_id'];
    $imageDir = IMAGES_DIR.'/'.$category_id;
    $files = glob($imageDir."/*.{jpg,jpeg,png,gif}", GLOB_BRACE);

    if (file_exists($imageUrl)) {
        unlink($imageUrl);
        if (empty($files)) {
            rmdir($imageDir);
        }
        $result  = DB::query("DELETE from images Where id = %i", $image_id);
        return true;
    } else {
        return false;
    }
}
function edit_gallery_image($image_id)
{
    $imageDetail = DB::query("SELECT * from images where id = %i", $image_id);
    $category = DB::query("SELECT id, category_title, category_description FROM category WHERE status = 'active' order by id desc");
    return array('status'=> true, 'data'=>$imageDetail, 'category'=>$category);
}

function update_gallery_image($data)
{
    $update = DB::update('images', ['image_title' => $data['title'], 'category_id'=> $data['category_id'], 'inserted_by' => $data['inserted_by']], "id=%i", $data['image_id']);
    return $update;
}
