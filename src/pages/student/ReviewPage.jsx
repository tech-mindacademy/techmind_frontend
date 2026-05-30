import { useSelector } from "react-redux";
import ReviewsSection from "./ReviewSection";
import { selectUser } from "../../store/slices/authSlice";

export default function ReviewsPage() {
  const user = useSelector(selectUser);
  return <ReviewsSection enrolledCourses={user?.enrolledCourses || []} />;
}