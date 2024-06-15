using Microsoft.AspNetCore.Mvc;
using ServerSideEx5.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ServerSideEx5.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        // GET: api/<CourseController>
        [HttpGet]
        public IEnumerable<Course> Get()
        {
            return Course.Read();
        
        }

        // GET api/<CourseController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CourseController>
        [HttpPost]
        public Course Post([FromBody] Course course)
        {
            return course.AddCourse();
        }

        [HttpGet("title/{courseTitle}")]
        public Course GetCourseByTitle(string courseTitle)
        {
            return Course.CourseByTitle(courseTitle);
        }
        // PUT api/<CourseController>/5
        [HttpPut("userUpdate")]
        public bool Put([FromBody] Course updatedCourse)
        {
            return updatedCourse.Update();
        }
        // PUT api/<CourseController>/5
        [HttpPut("quickEditCourse/{id}/{title}")]
        public bool QuickEdit(int id, string title, [FromBody] bool isActive)
        {
            Course course = new Course();
            return course.QuickEdit(id,title,isActive);
        }

        // DELETE api/<CourseController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (Course.Delete(id))
                return Ok(id);
            else return NotFound("There is no Course with this id:" + id);
        }
        [HttpGet("Top5Courses")]
       public Object Top5Courses()
        {
            Course course = new Course();
            return course.Top5();

        }

    }
}
