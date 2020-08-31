/* Add here all your JS customizations */
var rootUrl = "api/index.php/";
var rootUrl2 = "api.php/";
var http = new ajaxCall();
var method = "post";
var url = "";
var UPLOAD_MAX_SIZE = 3.0;
// the target size
var TARGET_W = 600; /*to set cropping width and height area*/
var TARGET_H = 600;
//  Delete Table Row Category
function delete_category(e) {
  var category_id = $.trim(e);
  data = {
    category_id: e,
  };
  http.send(
    data,
    rootUrl + "category/delete",
    "delete",
    function(response) {
      // console.log(response);
      if (response.status == true) {
        $("#category-result").html(
          '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>' +
          response.msg +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
        $("#row" + e).remove();
      } else {
        $("#category-result").html(
          '<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>' +
          response.msg +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
      }
    },
    "json",
    "application/x-www-form-urlencoded"
  );
}

function edit_category_image(image_id) {
  $("#image_gallery_display").css("display", "none");
  $("#image_gallery_edit").css("display", "block");
  const data = {
    image_id: $.trim(image_id)
  }
  var form = ''
  var categorieshtml = ''
  http.send(
    data,
    rootUrl + "image/edit",
    "put",
    function(response) {
      console.log(response);
      const data = response.data.data
      const category = response.data.category

      if (response.status == true) {
        category.forEach((item) => {
          const selected = item.id == data[0].category_id
          categorieshtml += "<option value=" +
            item.id +
            " selected=" + selected + ">";
          categorieshtml += item.category_title
          categorieshtml += "</option>"
        })
        form += "<form id='image_update_form' method='post'>"
        form += "<div class='form-group'><label for='category_dropdown_image_edit'>Select Category</label><select id='category_dropdown_image_edit' class='form-control'><option value='0'>Select One</option>"
        form += categorieshtml + "</select><div class='invalid-feedback'>Please Select One Option</div></div>"
        form += "<div class='form-group'><label for='title_image_edit'>Title</label><input type='text' class='form-control' id='title_image_edit' value=" + data[0].image_title + "/><div class='invalid-feedback'>Please enter title</div></div>"
        form += "<div class='form-group'><img src=public/" + data[0].image_url + " alt='image' helight='150px' width='150px'/></div>"
        form += "<input type='hidden' id='edit_image_id' value=" + data[0].id + "/>"
        form += "<div class='form-group'><button type='submit' id='btn-save' class='btn btn-primary'>Update Image</button></div>"
        $("div#image_gallery_edit_form").html(form);
      } else {
        form += "<div class='form-group'><button type='submit' id='btn-save' class='btn btn-primary'>Update Image</button></div>"
        $("div#image_gallery_edit_form").html(form);
      }
    },
    "json",
    "application/x-www-form-urlencoded"
  );
}

function delete_category_image(image_name) {
  // alert(image_name);
  var image = $.trim(image_name);
  data = {
    image_id: image,
  };
  http.send(
    data,
    rootUrl + "image/delete",
    "delete",
    function(response) {
      // console.log(response);
      if (response.status == true) {
        $("#catrgory-image-result").html(
          '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>' +
          response.msg +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
        $("#category_image" + image_name).remove();
      } else {
        $("#catrgory-image-result").html(
          '<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>' +
          response.msg +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        );
      }
    },
    "json",
    "application/x-www-form-urlencoded"
  );
}

function switchView(view) {
  $.get({
    url: view,
    cache: false,
  }).then(function(data) {
    $("#container").html(data);
  });
}
//  Display Categories

function get_all_categories() {
  $(function() {
    if ($("#categories").length > 0) {
      http.send(
        "",
        rootUrl + "categories/",
        "GET",
        function(response) {
          if (response.status == true) {
            var categorieshtml = "";
            response.data.forEach((category) => {
              categorieshtml += "<tr id='row" + category.id + "'>";

              //for category name
              categorieshtml += "<td>";
              categorieshtml += category.category_title;
              categorieshtml += "</td>";

              //for category description
              categorieshtml += "<td>";
              categorieshtml += category.category_description;
              categorieshtml += "</td>";
              categorieshtml += "<td>";
              categorieshtml +=
                "<button type='button' class='btn btn-danger btn-sm' onclick=" +
                "delete_category(" +
                category.id +
                ")" +
                " data-id=" +
                category.id +
                "> <span class='glyphicon glyphicon-remove'></span> Remove</button>";
              categorieshtml += "</td>";

              //for category thumbnail
              // categorieshtml += "<td> <img width='250' height='150' src='";
              // categorieshtml += category.val().thumbnail;
              // categorieshtml += "' /></td>";

              categorieshtml += "</tr>";
            });

            $("#categories").html(categorieshtml);
          } else {
            conosle.log(response.message);
          }
        },
        "json",
        "application/x-www-form-urlencoded"
      );
    }
  });
}

// Get Category

function get_dropdown_categories() {
  $(function() {
    if ($("#category-dropdown").length > 0) {
      http.send(
        "",
        rootUrl + "image/category",
        "GET",
        function(response) {
          $("#category-dropdown").append(
            "<option value='0'>Select One</option>"
          );

          if (response.status == true) {
            response.data.forEach((category) => {
              $("#category-dropdown").append(
                "<option value='" +
                category.id +
                "'>" +
                category.category_title +
                "</option>"
              );
            });
          } else {
            conosle.log(response.message);
          }
        },
        "json",
        "application/x-www-form-urlencoded"
      );
    }
    if ($("#category-image-dropdown").length > 0) {
      http.send(
        "",
        rootUrl + "image/category",
        "GET",
        function(response) {
          $("#category-image-dropdown").append(
            "<option value='0'>Select One</option>"
          );
          if (response.status == true) {
            response.data.forEach((category) => {
              $("#category-image-dropdown").append(
                "<option value='" +
                category.id +
                "'>" +
                category.category_title +
                "</option>"
              );
            });
          } else {
            conosle.log(response.message);
          }
        },
        "json",
        "application/x-www-form-urlencoded"
      );
    }
  });
}

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type: contentType
  });
  return blob;
}

$(function() {
  // Login form submission
  if ($("#login-form").length > 0) {
    $("#login-form").submit((e) => {
      e.preventDefault();
      $(".msg-signin").html(
        '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Please wait...<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
      );
      var email = $.trim($("#email").val());
      var password = $.trim($("#password").val());
      data = {
        email: email,
        password: password,
      };
      // console.log(data);
      http.send(
        data,
        rootUrl + "user/login",
        "post",
        function(response) {
          if (response.status == true) {
            $(".msg-signin").html(
              '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
            window.location.href = "admin.php";
          } else {
            $(".msg-signin").html(
              '<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
          }
        },
        "json",
        "application/x-www-form-urlencoded"
      );
    });
  }
  // Logout
  if ("#btn-logout".length > 0) {
    $("#btn-logout").click(() => {
      http.send(
        "",
        rootUrl + "user/logout",
        "GET",
        function(response) {
          if (response.status == true) {
            window.location.href = "index.php";
          }
        },
        "json"
      );
    });
  }
  // Add Category
  if ($("#category-form").length > 0) {
    $("#category-form").submit((e) => {
      e.preventDefault();
      $("#category-name").removeClass("is-invalid");
      $("#category-desc").removeClass("is-invalid");

      var category_title = $.trim($("#category-name").val());
      var category_description = $.trim($("#category-desc").val());
      if (!category_title) {
        $("#category-name").addClass("is-invalid");
        return;
      }
      var data = {
        category_title: category_title,
        category_description: category_description,
      };
      http.send(
        data,
        rootUrl + "category/create",
        "post",
        function(response) {
          if (response.status == true) {
            $("#category-form")[0].reset();
            $("#category-result").html(
              '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
            // $("#category-result").attr("class", "alert alert-success");
            // $("#category-result").html("Category added");
            get_all_categories();
          } else {
            $("#category-result").html(
              '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
            conosle.log(response.message);
          }
        },
        "json",
        "application/x-www-form-urlencoded"
      );
    });
  }

  /*
  Images

*/

  function previewWallpaper(thumbnail) {
    // destroy the Jcrop object to create a new one
    if (thumbnail.files && thumbnail.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#img-wallpaper").attr("src", e.target.result);
      };
      reader.readAsDataURL(thumbnail.files[0]);
    }
  }

  // Simple event handler, called from onChange and onSelect

  $("#wallpaper").change(function() {
    $("#wallpaper").removeClass("is-invalid");
    previewWallpaper(this);
  });

  // Save Image
  if ($("#image-form").length > 0) {
    $("#image-form").submit(function(e) {
      e.preventDefault();
      // var desc = $("#desc").val();
      // $("#desc").removeClass("is-invalid");
      $("#title").removeClass("is-invalid");
      $("#wallpaper").removeClass("is-invalid");
      $("#category-dropdown").removeClass("is-invalid");

      var category_id = $("#category-dropdown").val();
      var title = $("#title").val();
      var wallpaper = $("#wallpaper").prop("files")[0];
      var cropImageBase64 = $("#cropImage > img").attr("src");
      // console.log(cropImageBase64);
      // Split the base64 string in data and contentType
      // var block = cropImage.split(";");
      // // Get the content type of the image
      // var contentType = cropImage[0].split(":")[1]; // In this case "image/gif"
      // // get the real base64 content of the file
      // var realData = cropImage[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

      // Convert it to a blob to upload
      // var blob = b64toBlob(realData, contentType);
      // console.log(wallpaper);
      // return false;
      if (category_id == "0") {
        $("#category-dropdown").addClass("is-invalid");
        return;
      }
      if (!title) {
        $("#title").addClass("is-invalid");
        return;
      }
      // if (!desc) {
      //   $("#desc").addClass("is-invalid");
      //   return;
      // }
      if (!wallpaper) {
        $("#wallpaper").addClass("is-invalid");
        return;
      }
      if (cropImageBase64 == undefined) {
        $("#wallpaper").addClass("is-invalid");
        return;
      }
      var validImageTypes = ["image/gif", "image/jpeg", "image/png"];

      if ($.inArray(wallpaper["type"], validImageTypes) < 0) {
        $("#wallpaper").addClass("is-invalid");
        return;
      }
      var name = wallpaper["name"];
      let size = wallpaper["size"];
      size = (size / (1024 * 1024)).toFixed(2);

      var ext = name.substring(name.lastIndexOf("."), name.length);
      var orginalName = name.substr(0, name.lastIndexOf("."));
      var imagename = new Date().getTime();
      var image_dir = category_id + "/" + imagename + orginalName + ext;
      if (size < UPLOAD_MAX_SIZE) {
        var formData = new FormData();
        formData.append("category_id", category_id);
        formData.append("title", title);
        formData.append("wallpaperBase64", cropImageBase64);
        formData.append("image_dir", image_dir);
        formData.append("orginalName", orginalName);
        http.send(
          formData,
          rootUrl + "image/save",
          "post",

          function(response) {
            if (response.status == true) {
              $("#image-form")[0].reset();
              $("#img-wallpaper").attr("src", "");
              $("#progress").html("Completed");
              $("#image-result").html(
                '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>' +
                response.msg +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
              );
            } else {
              $("#image-result").html(
                '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>' +
                response.msg +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
              );
            }
          },
          "json",
          "multipart/form-data"
        );
      } else {
        if (!wallpaper) {
          $("#wallpaper").addClass("is-invalid");
          $("#contactError").html("Image Size Greater than 3 MB");
          return;
        }
      }
    });
  }

  // Get Images Using Category // ID

  if ($("#search-images-form").length > 0) {
    $("#search-images-form").submit(function(e) {
      e.preventDefault();
      $("#category-dropdown").removeClass("is-invalid");

      var category_id = $("#category-image-dropdown").val();
      if (category_id == "0") {
        $("#category-image-dropdown").addClass("is-invalid");
        return;
      }
      const data = {
        category_id: category_id,
      };
      http.send(
        data,
        rootUrl + "category/images",
        "GET",

        function(response) {
          if (response.status == true) {
            // console.log(response);
            var categorieshtml = "";
            response.data.forEach((item, index) => {
              // const newPath = imagePath.replace();
              categorieshtml +=
                "<div class='responsive' id='category_image" +
                item.id +
                "'>   <div class='gallery'>";

              //for category Imgae
              categorieshtml +=
                "  <a target='_blank' href=public/" + item.image_url + ">";
              categorieshtml +=
                "<img src=public/" +
                item.image_url +
                " alt='Image' width='600' height='400'/>";
              categorieshtml += "</a>";

              //for category Image Delete
              categorieshtml +=
                "<button type='button' class='btn btn-danger btn-sm' onclick=" +
                "delete_category_image(" +
                item.id +
                ")" +
                " data-id=" +
                item.id +
                "> <span class='glyphicon glyphicon-remove'></span> Remove</button>" +
                "<button type='button' class='btn btn-secondary btn-sm float-right' onclick=" +
                "edit_category_image(" +
                item.id +
                ")" +
                " data-id=" +
                item.id +
                "> <span class='glyphicon glyphicon-edit'></span> Edit</button>";
              categorieshtml += "</div>";
              categorieshtml += "</div>";
            });
            $("#category-images-display").html(categorieshtml);
          } else {
            $("#catrgory-image-result").html(
              '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
          }
        },
        "json"
      );
    });
  }

  // if ($("#back_image_gallery").length > 0) {
  $("#back_image_gallery").click(function() {
    $("#image_gallery_edit").css("display", "none");
    $("#image_gallery_display").css("display", "block");
  });

  if ($("div#image_gallery_edit_form").length > 0) {
    $("div#image_gallery_edit_form").submit(function(e) {
      e.preventDefault();
      $("#category_dropdown_image_edit").removeClass("is-invalid");
      var category_id = $("#category_dropdown_image_edit").val();
      if (category_id == "0") {
        $("#category_dropdown_image_edit").addClass("is-invalid");
        return;
      }
      $("#title_image_edit").removeClass("is-invalid");
      var category_id = $("#category_dropdown_image_edit").val();
      var title = $("#title_image_edit").val();
      if (category_id == "0") {
        $("#category_dropdown_image_edit").addClass("is-invalid");
        return;
      }
      if (!title) {
        $("#title_image_edit").addClass("is-invalid");
        return;
      }

      var image_id = $("#edit_image_id").val();
      const data = {
        category_id: category_id,
        title: title,
        image_id: image_id
      };
      http.send(
        data,
        rootUrl + "images/update",
        "put",

        function(response) {
          if (response.status == true) {
            // console.log(response);
            $("#edit_catrgory_image_result").html(
              '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
          } else {
            $("#edit_catrgory_image_result").html(
              '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>' +
              response.msg +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
          }
        },
        "json"
      );
    });
  }
});

function ajaxCall() {
  this.send = function(data, url, method, success, type, enctype) {
    type = type || "json";
    var successRes = function(data) {
      success(data);
    };
    var processData = true;
    var contentType = "application/x-www-form-urlencoded";
    var cache = true;
    if (enctype == "multipart/form-data") {
      var processData = false;
      var contentType = false;
      var cache = false;
    }
    var errorRes = function(e) {
      // console.log(e);
      const error = e.responseJSON != undefined ? e.responseJSON.msg : "";
      alert(
        "Error found \nError Code: " +
        e.status +
        " \nError Message: " +
        e.statusText +
        "\n" +
        error
      );
    };
    $.ajax({
      url: url,
      type: method,
      enctype: enctype,
      processData: processData,
      contentType: contentType,
      cache: cache,
      data: data,
      success: successRes,
      error: errorRes,
      dataType: type,
      timeout: 60000,
    });
  };
}
// "delete_category_image(" +
// "response.data[3]" +
// "," +
// "response.data[2]" +
// "," +
// "category_id" +
// ")" +
