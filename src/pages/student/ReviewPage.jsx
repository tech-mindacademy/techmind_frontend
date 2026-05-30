import { useSelector } from "react-redux";
import ReviewsSection from "./ReviewsSection";
import { selectUser } from "../../store/slices/authSlice";

export default function ReviewsPage() {
  const user = useSelector(selectUser);
  return <ReviewsSection enrolledCourses={user?.enrolledCourses || []} />;
}