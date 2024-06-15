
$(document).ready(function () {
    GetAdminCourses();
});
//admin render courses
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
        titleCol.textContent = course.title;
        const br = document.createElement('br');
        titleCol.appendChild(br);
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
            let apiQuick = `https://194.90.158.74/cgroup90/test2/tar1/api/Course/quickEditCourse/${course.id}/${text.value}`
            ajaxCall("PUT", apiQuick, JSON.stringify(checkbox.checked), QEditSCBF, QEditECBF)          
        };
        quickBtnCol.appendChild(quickBtn);
        row.appendChild(quickBtnCol);      
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

