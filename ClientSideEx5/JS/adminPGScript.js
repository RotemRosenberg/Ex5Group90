function createUserCourse(userId, courseId) {
    return { userId, courseId };
}
function createCourse(id, title, url, rating, numberOfReviews, instructorsId, imageReference, duration, lastUpdate) {
    return { id, title, url, rating, numberOfReviews, instructorsId, imageReference, duration, lastUpdate };
}
$(document).ready(function () {
    GetAdminCourses();
    InstructorSelect();

    $("#insertCourseBTN").click(function () {
        insertCourse();
    });
});
//add course
function insertCourse() {
    document.getElementById('containerTable').innerHTML = "";
    editCourseForm.style.display = "block";
    document.getElementById("labelInstructorID").style.display = "block";
    document.getElementById("instructorIDTB").style.display = "block";
    $('#instructorIDTB, #fileURLTB').attr('required', 'required');
    $("#editCourseForm").submit(function (e) {
        e.preventDefault();
        submitInsertCourse();
    });
}
//render all instructor to select option for insert course
function InstructorSelect() {
    let instructorSelect = document.getElementById('instructorIDTB');
    for (let i = 1; i <= 80; i++) {
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

    let apiImg = "https://localhost:7020/api/Upload";
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

    console.log('https://localhost:7020/images/' + data);
    localStorage.setItem('img1', 'https://localhost:7020/images/' + data)
    Insert();
}

function error(data) {
    console.log(data);
    localStorage.removeItem('img1')
}
function Insert() {
    let newCourse = createCourse(0, $("#courseTitleTB").val(), $("#courseURLTB").val(), 0, 0, parseInt($("#instructorIDTB").val()), localStorage.getItem('img1'), parseFloat($("#courseDuration").val()), 'd');
    console.log(newCourse);
    let api = `https://localhost:7020/api/Course`;
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
    let api = 'https://localhost:7020/api/UserCourse';
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
//admin render courses
function GetAdminCourses() {
    let api = `https://localhost:7020/api/UserCourse/` + localStorage.getItem("loggedUser");
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

    const container = document.getElementsByTagName('tbody')[0];
    for (let course of data) {
        const row = document.createElement('tr');
        //image
        const imageCol = document.createElement('td');
        const img = document.createElement('img');
        img.src = course.imageReference;
        img.alt = course.title;
        img.style.width = '50px'; // Adjust the size as needed
        imageCol.appendChild(img);
        row.appendChild(imageCol);

    //id
        const idCol = document.createElement('td');
        idCol.textContent = course.id; 
        row.appendChild(idCol);

        //title
        const titleCol = document.createElement('td');
        const text = document.createElement('input');
        text.type = 'text';
        text.value = course.title;
        titleCol.appendChild(text);
        row.appendChild(titleCol);

        //url
        const urlCol = document.createElement('td');
        const urlLink = document.createElement('a');
        urlLink.href = `https://udemy.com${course.url}`;
        urlLink.target = '_blank';
        urlLink.textContent = 'View Course';
        urlCol.appendChild(urlLink);
        row.appendChild(urlCol);

        //rating
        const ratingCol = document.createElement('td');
        ratingCol.textContent = course.rating.toFixed(2);
        row.appendChild(ratingCol);

        //number Of Reviews
        const reviewsCol = document.createElement('td');
        reviewsCol.textContent = course.numberOfReviews;
        row.appendChild(reviewsCol);

        //instructor
        const instructorCol = document.createElement('td');
        instructorCol.textContent = localStorage.getItem(course.instructorsId);
        row.appendChild(instructorCol);


        //duration
        const durationCol = document.createElement('td');
        durationCol.textContent = course.duration.toFixed(2);
        row.appendChild(durationCol);

        //last update
        const updateCol = document.createElement('td');
        updateCol.textContent = course.lastUpdate;
        row.appendChild(updateCol);

        //is active
        const isActiveCol = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = course.isActive;
        isActiveCol.appendChild(checkbox);
        row.appendChild(isActiveCol);


        //quick edit btn
        const quickBtnCol = document.createElement('td');
        let quickBtn = document.createElement('button');
        quickBtn.innerText = 'Quick Edit';
        quickBtn.onclick = function () {
            let apiQuick = `https://localhost:7020/api/Course/quickEditCourse/${course.id}/${text.value}`
            ajaxCall("PUT", apiQuick, JSON.stringify(checkbox.checked), QEditSCBF, QEditECBF)          
        };
        quickBtnCol.appendChild(quickBtn);
        row.appendChild(quickBtnCol);



        //edit btn
        const btnCol = document.createElement('td');
        let btn = document.createElement('button');
        btn.innerText = 'Edit Course';
        btn.onclick = function () {            
                $("#instructorIDTB").removeAttr('required');
                $("#fileURLTB").removeAttr('required');
                $('#courseIDLabel').hide();
                $('#labelInstructorID').hide();
                $('#instructorIDTB').hide();
                renderSpecificCourse(course)

        };
        btnCol.appendChild(btn);
        row.appendChild(btnCol);
        container.appendChild(row);
    }
    new DataTable('#example', {
        paging: false,
        scrollCollapse: true,
        scrollY: '600px'
    }); }
///quick edit
function QEditSCBF(result) {
    console.log("Quick Edit successful:", result);
    alert("Course updated successfully!");
    location.reload();
}

function QEditECBF(err) {
    console.log("Update failed:", err);
    alert("Failed to update the course.");
}
//edit course

function renderSpecificCourse(course) {
    document.getElementById('containerTable').innerHTML = "";
    const container = document.getElementById('containerCourse');
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
                        <p>Duration: ${course.duration.toFixed(2)}</p>
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
            const editCourseForm = document.getElementById("editCourseForm");
            editCourseForm.style.display = "block";
            submitUpdateCourse(course);
        });
    };
    courseDiv.appendChild(btn);
    container.appendChild(courseDiv);
}
function submitUpdateCourse(course) {
    uploadImg();
    let editCourse = createCourse(course.id, $("#courseTitleTB").val(), $("#courseURLTB").val(), course.rating, course.numberOfReviews, course.instructorsId, localStorage.getItem('img1'), parseFloat($("#courseDuration").val()), course.lastUpdate);
    let api = 'https://localhost:7020/api/Course/userUpdate';
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

    let apiImg = "https://localhost:7020/api/Upload";
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
    console.log('https://localhost:7020/images/' + data);
    localStorage.setItem('img1', 'https://localhost:7020/images/' + data)
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