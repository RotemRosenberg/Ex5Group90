
function createUserCourse(userId, courseId) {
    return { userId, courseId };
}
function createCourse(id, title, url, rating, numberOfReviews, instructorsId, imageReference, duration, lastUpdate) {
    return { id, title, url, rating, numberOfReviews, instructorsId, imageReference, duration, lastUpdate };
}
$(document).ready(function () {
    GetAdminCourses();
    $("#insertCourseBTN").click(function () {
        insertCourse();
    });
  
    InstructorSelect();
    $("#findCourseBTN").click(function () {
        const courseTitle = $("#courseSearch").val();
        if (courseTitle) {
            findSpecificCourse(courseTitle);
        } else {
            alert("Please choose a course first");
        }
    });


});

//-------------------------------------------------------//
//----------------Render Admin Courses-------------------//
//-------------------------------------------------------//
function GetAdminCourses() {
    let api = `https://194.90.158.74/cgroup90/test2/tar1/api/UserCourse/` + localStorage.getItem("loggedUser");
    ajaxCall("GET", api, "", getSCBF, getECBF)
}

function getSCBF(result) {
    RenderCourses(result);
    console.log(result);
}

function getECBF(err) {
    console.log(err);

}

function RenderCourses(data) {

    const container = document.getElementById('containerCourses');
    for (let course of data) {
        const courseDiv = document.createElement('div');
        courseDiv.id = "courseDiv";
        const html = `
                        <img src="${course.imageReference}" alt="${course.title}">
                        <h2>${course.title}</h2>
                        <p>Instructor: ${localStorage.getItem(course.instructorsId)}</p>
                        <p>Rating: ${course.rating.toFixed(2)}</p>
                        <p>Number of Reviews: ${course.numberOfReviews}</p>
                        <p>Last Update Date: ${course.lastUpdate}</p>
                        <p>Duration: ${course.duration.toFixed(2)}</p>
                        <a href="https://udemy.com${course.url}" target="_blank">View Course</a>
                                   `;
        courseDiv.innerHTML = html;
        let btn = document.createElement('button');
        btn.innerText = 'Edit Course';
        btn.onclick = function () {
                $("#instructorIDTB").removeAttr('required');
                $("#imageURLTB").removeAttr('required');
                $('#courseIDLabel').hide();
                $('#labelInstructorID').hide();
                $('#instructorIDTB').hide();
            renderSpecificCourse(course)
        }
        courseDiv.appendChild(btn);

        container.appendChild(courseDiv);
        const datalist = document.getElementById("courses");
        const option = document.createElement('option');
        option.value = course.title;
        datalist.appendChild(option);
    }
}

//-------------------------------------------------------//
//-------------------Insert Courses----------------------//
//-------------------------------------------------------//
function insertCourse() {
    document.getElementById('containerCourses').innerHTML = "";
    editCourseForm.style.display = "block";
    document.getElementById("labelInstructorID").style.display = "block";
    document.getElementById("instructorIDTB").style.display = "block";

    $('#instructorIDTB, #imageURLTB').attr('required', 'required');
    $("#editCourseForm").submit(function (e) {
        e.preventDefault();
        submitInsertCourse();
    });

}

//render all instructor to select option for insert course
function InstructorSelect() {
    let instructorSelect = document.getElementById('instructorIDTB');
    for (let i = 1; i <= 80; i++ ) {
        let instructorOption = document.createElement('option')
        instructorOption.text = localStorage.getItem(i);
        instructorOption.value = i;
        instructorSelect.appendChild(instructorOption);
    }
}

function submitInsertCourse() {
    var data = new FormData();
    var files = $("#fileURLTB").get(0).files;

    // Add the uploaded file to the form data collection  
    if (files.length > 0) {
        for (f = 0; f < files.length; f++) {
            data.append("files", files[f]);
        }
    }

    let apiImg = "https://194.90.158.74/cgroup90/test2/tar1/api/Upload";
    // Ajax upload  
    $.ajax({
        type: "POST",
        url: apiImg,
        contentType: false,
        processData: false,
        data: data,
        success: showImages,
        error: error,
        async: false

    });
    console.log(data);
}
function showImages(data) {

    console.log('https://194.90.158.74/cgroup90/test2/tar1/images/' + data);
    localStorage.setItem('img1', 'https://194.90.158.74/cgroup90/test2/tar1/images/' + data)
    Insert();
}

function error(data) {
    console.log(data);
    localStorage.removeItem('img1')
}
function Insert() {
    let newCourse = createCourse(0, $("#courseTitleTB").val(), $("#courseURLTB").val(), 0, 0, parseInt($("#instructorIDTB").val()), localStorage.getItem('img1'), parseFloat($("#courseDuration").val()), 'd');
    console.log(newCourse);
    let api = `https://194.90.158.74/cgroup90/test2/tar1/api/Course`;
    ajaxCall("POST", api, JSON.stringify(newCourse), insertSCBF, insertECBF);
}
function insertSCBF(result) {
    alert("Course created successfully!");
    console.log("Inserted successfully:", result);
    AddAdminCourse(result);
    editCourseForm.style.display = "none";
    document.getElementById('editCourseForm').reset();
    localStorage.removeItem('img1');
    location.reload();
}
function AddAdminCourse(course) {
    let adminCourse = createUserCourse(1, course.id)
    let api = 'https://194.90.158.74/cgroup90/test2/tar1/api/UserCourse';
    ajaxCall("POST", api, JSON.stringify(adminCourse), adminSCBF, adminECBF); //add to admin this course
}

function insertECBF(err) {
    console.log("Update failed:", err);
    alert("Failed to insert the course.");

}
function adminSCBF(result) {
    console.log(result);

}
function adminECBF(err) {
    console.log(err);
}

//-------------------------------------------------------//
//-------------------Edit Courses----------------------//
//-------------------------------------------------------//

function renderSpecificCourse(course) {
    const container = document.getElementById('containerCourses');
    container.innerHTML = "";
    const courseDiv = document.createElement('div');
    courseDiv.id = "courseDiv";
        const html = `
                        <img src="${course.imageReference}" alt="${course.title}">
                        <h2>${course.title}</h2>
                        <p>Instructor: ${localStorage.getItem(course.instructorsId)}</p>
                        <p>Rating: ${course.rating.toFixed(2)}</p>
                        <p>Number of Reviews: ${course.numberOfReviews}</p>
                        <p>Last Update Date: ${course.lastUpdate}</p>
                        <p>Duration: ${course.duration}</p>
                        <a href="https://udemy.com${course.url}" target="_blank">View Course</a>
                                   `;
        courseDiv.innerHTML = html;
    //add course btn
    let btn = document.createElement('button');
    btn.innerText = 'Edit Course';
    btn.onclick = function () {
        const editCourseForm = document.getElementById("editCourseForm");
        editCourseForm.style.display = "block";
        $("#editCourseForm").submit(function (e) {
            e.preventDefault();
            submitUpdateCourse(course);
        });
    };
    courseDiv.appendChild(btn);
    container.appendChild(courseDiv);
}
function submitUpdateCourse(course) {
    uploadImg();
    let editCourse = createCourse(course.id, $("#courseTitleTB").val(), $("#courseURLTB").val(), course.rating, course.numberOfReviews, course.instructorsId, localStorage.getItem('img1'), parseFloat($("#courseDuration").val()), course.lastUpdate);
    let api = 'https://194.90.158.74/cgroup90/test2/tar1/api/Course/userUpdate';
    ajaxCall("PUT", api, JSON.stringify(editCourse), updateSCBF, updateECBF);

}
function uploadImg() {

    var data = new FormData();
    var files = $("#fileURLTB").get(0).files;

    // Add the uploaded file to the form data collection  
    if (files.length > 0) {
        for (f = 0; f < files.length; f++) {
            data.append("files", files[f]);
        }
    }

    let apiImg = "https://194.90.158.74/cgroup90/test2/tar1/api/Upload";
    // Ajax upload  
    $.ajax({
        type: "POST",
        url: apiImg,
        contentType: false,
        processData: false,
        data: data,
        success: showImagesEdit,
        error: error2,
        async: false
    });
    console.log(data);
}
function showImagesEdit(data) {
    console.log('https://194.90.158.74/cgroup90/test2/tar1/images/' + data);
    localStorage.setItem('img1', 'https://194.90.158.74/cgroup90/test2/tar1/images/' + data)
}

function error2(data) {
    console.log(data);
    localStorage.removeItem('img1')
}
function updateSCBF(result) {
    console.log("Update successful:", result);
    editCourseForm.style.display = "none";
    alert("Course updated successfully!");
    document.getElementById('editCourseForm').reset();
    localStorage.removeItem('img1');
    location.reload();
}

function updateECBF(err) {
    console.log("Update failed:", err);
    alert("Failed to update the course.");
    localStorage.removeItem('img1')
}

//-------------------------------------------------------//
//-------------------Search Courses----------------------//
//-------------------------------------------------------//

function findSpecificCourse(title) {
    let api = 'https://194.90.158.74/cgroup90/test2/tar1/api/Course/title/'+title;
    ajaxCall("GET", api, "", findSCBF, findECBF);
}

function findSCBF(result) {
    renderSpecificCourse(result);
}

function findECBF(err) {
    console.log(err);
    alert("Failed to find the course.");
}