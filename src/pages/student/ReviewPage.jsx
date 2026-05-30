import { useEffect, useState } from "react";
import ReviewsSection from "./ReviewSection";
import api from "../../api/axios"; // adjust path

export default function ReviewsPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    api.get("/enrollments/my")
      .then(({ data }) => {
        const courses = data.enrollments.map((e) => ({
          course: { _id: e.course._id, title: e.course.title },
        }));
        setEnrolledCourses(courses);
      })
      .catch(() => setEnrolledCourses([]));
  }, []);

  return <ReviewsSection enrolledCourses={enrolledCourses} />;
}