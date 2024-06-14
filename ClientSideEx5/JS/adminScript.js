
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
    $("#editCourseForm").submit(function (e) {
        e.preventDefault();
        submitInsertCourse();
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
    //$("#editCourseForm").submit(function (e) {
    //    e.preventDefault();
    //    submitInsertCourse();
    //    $("#instructorIDTB").removeAttr('required');
    //    $("#imageURLTB").removeAttr('required');
    //    $('#courseIDLabel').hide();
    //    $('#labelInstructorID').hide();
    //    $('#instructorIDTB').hide();
    //    location.reload();
    //});

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
    let newCourse = createCourse(0, $("#courseTitleTB").val(), $("#courseURLTB").val(), 0, 0, parseInt($("#instructorIDTB").val()), $("#imageURLTB").val(), parseFloat($("#courseDuration").val()), 'd');
    console.log(newCourse);
    let api = `https://194.90.158.74/cgroup90/test2/tar1/api/Course`;
    ajaxCall("POST", api, JSON.stringify(newCourse), insertSCBF, insertECBF);
}

function insertSCBF(result) {
    alert("Course created successfully!");
    console.log("Inserted successfully:", result);
    AddAdminCourse(result);
    setTimeout(function () {
        editCourseForm.style.display = "none";
        document.getElementById('editCourseForm').reset();
        GetAdminCourses();
    }, 2000);

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
    let editCourse = createCourse(course.id, $("#courseTitleTB").val(), $("#courseURLTB").val(), course.rating, course.numberOfReviews, course.instructorsId , $("#imageURLTB").val(), parseFloat($("#courseDuration").val()), course.lastUpdate);
    let api = 'https://194.90.158.74/cgroup90/test2/tar1/api/Course/userUpdate';
    ajaxCall("PUT", api, JSON.stringify(editCourse), updateSCBF, updateECBF);

}

function updateSCBF(result) {
    console.log("Update successful:", result);
    editCourseForm.style.display = "none";
    alert("Course updated successfully!");
    document.getElementById('editCourseForm').reset();
    GetAdminCourses();
    location.reload();
}

function updateECBF(err) {
    console.log("Update failed:", err);
    alert("Failed to update the course.");
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