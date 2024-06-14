$(document).ready(function () {
    GetInstructors();
    GetCourses();
    $("#backBTN").click(GetCourses);
    if (localStorage.getItem("loggedUser")) {
        $("#loginBTN").hide();
        $("#registerBTN").hide();
        $("#logoutBTN").show();
        $("#myCourseBTN").show();

    }
    else {
        $("#loginBTN").show();
        $("#registerBTN").show();
        $("#logoutBTN").hide();
        $("#myCourseBTN").hide();

    }
    if (localStorage.getItem("loggedUser") == 1) {
        $("#adminBTN").show();
    }
    else {
        $("#adminBTN").hide();
    }
    $("#loginBTN").click(openLoginForm);
    $("#registerBTN").click(function () {
        openRegistrationForm();
    });
    $("#logoutBTN").click(Logout);
});
const createUserCourse = (userId, courseId) => ({ userId, courseId });
//-------------------------------------------------------//
//----------------Render Courses and Instructors---------//
//-------------------------------------------------------//

function GetCourses() {
    let api = `https://194.90.158.74/cgroup90/test2/tar1/api/Course`;
    ajaxCall("GET", api, "", getSCBF, getECBF);
}
function getSCBF(result) {
    RenderCourses(result);
    console.log(result);
}

function getECBF(err) {
    console.log(err);

}

function GetInstructors(id) {
    let api = `https://194.90.158.74/cgroup90/test2/tar1/api/Instructor`;
     ajaxCall("GET", api, "",getISCBF, getIECBF);
}
function getISCBF(result) {
    renderInstructor(result);
    console.log(result);
}

function getIECBF(err) {
    console.log(err);

}

function renderInstructor(data) {
    for (let instructor of data) {
        localStorage.setItem(instructor.id, instructor.name);
    }
}
function RenderCourses(data)
{

    document.getElementById('containerInstructorCourses').innerHTML = '';
    document.getElementById('backBTN').style.display = 'none';
    const container = document.getElementById('containerCourses');
    const titleDiv = document.getElementById('title');
    titleDiv.textContent = 'Udemy Courses';
    for (let course of data) {
        const courseDiv = document.createElement('div');
        courseDiv.id = "courseDiv";
        const html = `
                        <img src="${course.imageReference}" alt="${course.title}">
                        <h2>${course.title}</h2>
                        <p>Instructor: ${localStorage.getItem(course.instructorsId) }</p>
                        <p>Rating: ${course.rating.toFixed(2)}</p>
                        <p>Number of Reviews: ${course.numberOfReviews}</p>
                        <p>Last Update Date: ${course.lastUpdate}</p>
                        <p>Duration: ${course.duration.toFixed(2)}</p>
                        <a href="https://udemy.com${course.url}" target="_blank">View Course</a>
                                   `;
        courseDiv.innerHTML = html;
        let btnInstructor = document.createElement('button');
        btnInstructor.innerText = 'Show more courses of this instructor';
        btnInstructor.onclick = function () {

            let api = `https://194.90.158.74/cgroup90/test2/tar1/api/Instructor/` + course.instructorsId;
            ajaxCall("GET", api, "", getICSCBF, getICECBF);


        }
        let btnAdd = document.createElement('button');
        btnAdd.innerText = 'AddCourse';
        btnAdd.onclick = function () {
            if (localStorage.getItem("loggedUser") != 1 && localStorage.getItem("loggedUser")) {
            
            let UserCourse = createUserCourse(localStorage.getItem("loggedUser"), course.id);
                let api = `https://194.90.158.74/cgroup90/test2/tar1/api/UserCourse`;
            ajaxCall("POST", api, JSON.stringify(UserCourse), postCourseSCBF, postCourseECBF);
            }
        else alert("please login")
        }
        courseDiv.appendChild(btnInstructor);
        courseDiv.appendChild(btnAdd);
        container.appendChild(courseDiv);
    }
}
function getICSCBF(result) {
    RenderInstructorCourses(result);
    console.log(result);
}

function getICECBF(err) {
    console.log(err);

}
function postCourseSCBF(result) {
    alert('The course was successfully added');
    console.log(result);
}

function postCourseECBF(err) {
    alert("The course has already been added")
    console.log(err);

}
//Render Instructor Courses
function RenderInstructorCourses(courses) {
    GetInstructors();
    document.getElementById('containerCourses').innerHTML = '';
    const container = document.getElementById('containerInstructorCourses');

    //btn back to main
    document.getElementById('backBTN').style.display = 'block'; 
    //render courses
    let name;
    for (let course of courses) {
        const courseDiv = document.createElement('div');
        const title = document.createElement('h1');
        title.textContent = localStorage.getItem(course.instructorsId) + ' Courses';
        courseDiv.appendChild(title);
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
        container.appendChild(courseDiv);
        name = localStorage.getItem(course.instructorsId);
    }

    //title
    const titleDiv = document.getElementById('title');
    titleDiv.textContent = name;
}


//-------------------------------------------------------//
//---------------------User system-----------------------//
//-------------------------------------------------------//

//loggin form
function openLoginForm() {
    var url = "loginForm.html";

    var width = 600;
    var height = 700;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    var features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    // Open the registration form page in a pop-up window
    window.open(url, "_blank", features);

}

//register form
function openRegistrationForm() {
    var url = "RegisterForm.html";

    var width = 600;
    var height = 700;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    var features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    // Open the registration form page in a pop-up window
    window.open(url, "_blank", features);
}

//Logout
function Logout() {
    if (localStorage.getItem("loggedUser")) {
        localStorage.removeItem("loggedUser");
        alert("Disconnected succefully");
        location.reload();
    }
    else {
        alert("You must be logged in in order to logout");
    }
}