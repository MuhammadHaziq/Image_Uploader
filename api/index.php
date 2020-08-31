<?php

require_once '../config/meekro_db.php';
require_once '../functions/lib.php';
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

// $container = $app->getContainer();
// $container['upload_directory'] = __DIR__ . '/uploads';
##### Default Get Url for testing only ####
$app->get('/hello', function () {
    $template = "Hello";
    echo $template;
});

##### User Account Management and Authentication ####
// duplicate email exists
$app->post('/user/login', function () use ($app) {
    $credentials = $app->request()->post();
    // var_dump($credentials);
    $email = $credentials["email"];
    $password = $credentials["password"];
    $encryptPassword = encryptIt($password);
    $account = login_user($email, $encryptPassword);
    // var_dump($account);
    if ($account && $account["email"] == $email) {
        session_start();
        $_SESSION["isUserLoggedIn"] = true;
        $_SESSION["userProfile"] = $account;
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Redirecting...",'session'=>$_SESSION)));
        return;
    } else {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Invalid Username/Email or Password")));
        return;
    }
});

$app->get('/user/logout', function () use ($app) {
    unset($_SESSION["isUserLoggedIn"]);
    unset($_SESSION["userProfile"]);
    session_destroy();
    $app->response()->status(200);
    $app->response()->header('Content-Type', 'application/json');
    $app->response()->write(json_encode(array("status" => true, "msg" => "Logout...")));
    return;
});

$app->get('/categories/', function () use ($app) {
    $response = get_categories();
    $app->response()->status(200);
    $app->response()->header('Content-Type', 'application/json');
    $app->response()->write(json_encode(array("status" => true, "data" => $response)));
    return;
});

$app->post('/category/create', function () use ($app) {
    session_start();
    $request = $app->request()->post();
    $category_title = $request['category_title'];
    $category_description = $request['category_description'];
    $inserted_by = $_SESSION["userProfile"]['id'];

    $response =   save_category($category_title, $category_description, $inserted_by);
    if ($response == 1) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Category Created")));
        return;
    } else {
        $app->response()->status(409);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => $response)));
        return;
    }
});

$app->delete('/category/delete', function () use ($app) {
    session_start();
    $request = $app->request()->post();
    $category_id =$request['category_id'];
    $inserted_by = $_SESSION["userProfile"]['id'];
    $response =   delete_category($category_id);
    if ($response) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Category Deleted Successfully")));
        return;
    } else {
        $app->response()->status(400);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Category Not Deleted Successfully Alrerady Assign To Images")));
        return;
    }
});
/*
    Images

*/

$app->get('/image/category', function () use ($app) {
    $response = get_dropdown_categories();
    $app->response()->status(200);
    $app->response()->header('Content-Type', 'application/json');
    $app->response()->write(json_encode(array("status" => true, "data" => $response)));
    return;
});

$app->post('/image/crop_image', function () use ($app) {
    $request = $app->request()->post();
    // $directory = $this->get('upload_directory');
    // $uploadedFiles = $app->getUploadedFiles();
    $data = array('x' => $request['x'],
    'y' => $request['y'],
    'w' => $request['w'],
    'h' => $request['h'],
    'targ_w' => $request['targ_w'],
  'targ_h' => $request['targ_h'] ,
'photo_url' => $request['photo_url']
  );
    $response =   crop_image($data);
    if ($response) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "data" => $response)));
        return;
    } else {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Image Not Saved")));
        return;
    }
});


$app->post('/image/save', function () use ($app) {
    session_start();
    $request = $app->request()->post();
    // $directory = $this->get('upload_directory');
    // $uploadedFiles = $app->getUploadedFiles();
    // 'image' => $_FILES['wallpaper'],
    $data = array('category_id' => $request['category_id'],
    'title' => $request['title'],
    'image' => $request['wallpaperBase64'],
    'image_dir' => $request['image_dir'],
    'inserted_by' => $_SESSION["userProfile"]['id'],
    'orginalName' => $request['orginalName'] );
    $response =   save_image($data);
    if ($response == 1) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Image Saved")));
        return;
    } else {
        $app->response()->status(409);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Image Not Saved", 'exception' => $response)));
        return;
    }
});

$app->delete('/image/delete', function () use ($app) {
    session_start();
    $request = $app->request()->post();
    $image_id =$request['image_id'];
    $inserted_by = $_SESSION["userProfile"]['id'];
    $response =   delete_image($image_id);
    if ($response) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Image Deleted Successfully", 'resposne'=>$response)));
        return;
    } else {
        $app->response()->status(400);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Image Not Deleted Successfully ", 'resposne'=>$response)));
        return;
    }
});
$app->put('/image/edit', function () use ($app) {
    session_start();
    $request = $app->request()->post();
    $image_id =$request['image_id'];
    $inserted_by = $_SESSION["userProfile"]['id'];
    $response =   edit_gallery_image($image_id);
    if ($response.status == true) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Get Image Detail Successfully", 'data'=>$response )));
        return;
    } else {
        $app->response()->status(400);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Not Get Image Detail Successfully", 'data'=>[] )));
        return;
    }
});
$app->put('/images/update', function () use ($app) {
    session_start();
    $request = $app->request()->post();
    $data = array('category_id' => $request['category_id'],
    'title' => $request['title'],
    'category_id' => $request['category_id'],
    'image_id' => $request['image_id'],
  'inserted_by'=>$_SESSION["userProfile"]['id'] );
    // $image_id =$request['image_id'];
    //     $category_id =$request['category_id'];
    //         $title =$request['title'];
    // $inserted_by = $_SESSION["userProfile"]['id'];
    $response =   update_gallery_image($data);
    if ($response == true) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "msg" => "Get Image Detail Successfully" )));
        return;
    } else {
        $app->response()->status(400);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Not Get Image Detail Successfully" )));
        return;
    }
});
$app->post('/user/create', function () use ($app) {
    // TO DO: Mail is not sending;
    $credentials = $app->request()->post();

    $email = $credentials["username"];
    $password = $credentials["password"];
    $confirmpassword = $credentials["confirmpassword"];

    // validate email address format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Email address is invalid. Please provide correct email address.")));
        return;
    }

    // validating password
    if ($password != $confirmpassword) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Password and Confirm Password do not match")));
        return;
    }

    // password hashed
    $encryptPassword = encryptIt($password);

    // create new usr
    $data = array("username" => $email, "email" => $email, "password" => $encryptPassword);

    $account = DB::insert("usr", $data);
    // new user id
    $data["id"] = DB::insertId();

    // send verification email of account created
    if ($account && $data["id"] > 0) {
        $mail = new PHPMailer();
        $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Password = 'Johnvik1996';                           // SMTP password
    $mail->Username = 'johnvik031@gmail.com';                 // SMTP username
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                                    // TCP port to connect to

    $mail->setFrom('johnvik031@gmail.com', 'John Vik');
        $mail2 = clone $mail;
        //$mail->addReplyTo($email);
        //$mail->addAddress($email);
        $rows = getAdminsStatus();
        foreach ($rows as $admin) {
            $mail->AddCC($admin['email']);
        }
        // if (BCC_EMAIL) {
        //     $mail->addBCC('johnvik031@gmail.com', 'John');
        // }

        //$mail->Subject(JOIN_EMAIL_SUBJECT);
        $mail->Subject = "Please review an account!";

        $activationcode = generateRandomString(16);
        $mailHtml = getVerifyEmailText($email, $activationcode);

        // update activation code and time
        $activationData = array(
      "activationcode" => $activationcode,
      "activationcode_updated_on" => getTimeStamp(false)
    );

        DB::update("usr", $activationData, "id=%i", $data["id"]);
        $mail->msgHTML($mailHtml);
        $sendMail = $mail->send();
        /*
        Send Email To User Congrat
        */
        $mail2->addReplyTo($email);
        $mail2->addAddress($email);
        $mail2->Subject = "Account under review by Camaashley.com support";
        $mailBody = getCongratText($email);
        $mail2->msgHTML($mailBody);
        $userMail = $mail2->send();

        // mail sent
        if ($sendMail == true && $userMail == true) {
            // account created response
            $app->response()->status(200);
            $app->response()->header('Content-Type', 'application/json');
            // Please check your inbox and verify your email address to access account
            $app->response()->write(json_encode(array("status" => true, "msg" => "An activation email is sent to your email address. Check Your Inbox")));
            return;
        } else {
            // delete created account if verify email sent failed and ask to try again
            //DB::delete("usr", "email=%s", $email);
            // account not created
            $app->response()->status(200);
            $app->response()->header('Content-Type', 'application/json');
            $app->response()->write(json_encode(array("status" => false, "msg" => "Something went wrong Email. Please try again")));
            return;
        }
    } else {
        // bad request format
        $app->response()->status(400);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => "Something went wrong. Please try again")));
        return;
    }
});

//  Category IMages
$app->get('/category/images', function () use ($app) {
    $category_id = $app->request()->get('category_id');
    $response = get_category_images($category_id);
    if ($response !== false) {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => true, "data" => $response)));
        return;
    } else {
        $app->response()->status(200);
        $app->response()->header('Content-Type', 'application/json');
        $app->response()->write(json_encode(array("status" => false, "msg" => 'No Image Found')));
        return;
    }
});
// get folder by id
/*
$app->get('/folders/:id', function ($id) {
$template = "Hello";
echo $template;
});


$app->put('/put', function () {
echo 'This is a PUT route';
});


$app->patch('/patch', function () {
echo 'This is a PATCH route';
});


$app->delete('/delete', function () {
echo 'This is a DELETE route';
});
*/

$app->run();
