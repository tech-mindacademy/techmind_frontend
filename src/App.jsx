import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  selectIsInitialized,
  selectIsAuthenticated,
  selectUser,
} from "./store/slices/authSlice";

import { useAdminSessionGuard } from "./hooks/useAdminSessionGaurd";
import ScrollToTop from "./components/ScrollToTop";

// ── Eagerly loaded (routing infra) ──────────────────────────────────────────
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// ── Navbar / Footer (only used in public layout) ─────────────────────────────
// Replace these with your actual Navbar and Footer component paths
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/ui/SplashScreen";

// ─────────────────────────────────────────────────────────────────────────────
// LAZY IMPORTS — grouped by role for better chunk splitting
// ─────────────────────────────────────────────────────────────────────────────

// Auth
const AuthPage             = lazy(() => import("./pages/auth/AuthPage"));
const ForgotPasswordPage   = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage    = lazy(() => import("./pages/auth/ResetPasswordPage"));
const VerifyEmailPage      = lazy(() => import("./pages/auth/VerifyEmailPage"));

// Public pages
const LandingPage            = lazy(() => import("./pages/LandingPage"));
const CourseCataloguePage    = lazy(() => import("./pages/CourseCataloguePage"));
const CourseDetailPage       = lazy(() => import("./pages/CourseDetailPage"));
const NotFoundPage           = lazy(() => import("./pages/NotFoundPage"));
const UnauthorizedPage       = lazy(() => import("./pages/UnauthorizedPage"));
const CoursesLandingPage     = lazy(() => import("./pages/CoursesLandingPage"));
const AboutUs                = lazy(() => import("./pages/AboutUs"));
const InternshipsPage        = lazy(() => import("./pages/InternshipPage"));
const CertificatePurchasePage= lazy(() => import("./pages/CertificatePurchasePage"));
const ProfileModal           = lazy(() => import("./components/ProfileModal"));
const Service                = lazy(() => import("./pages/Service"));
const RefundPolicyPage       = lazy(() => import("./pages/RefundPolicyPage"));
const PrivacyPolicyPage      = lazy(() => import("./pages/PrivacyPolicyPage"));
const BlogsPage              = lazy(() => import("./pages/BlogsPage"));
const BlogDetailPage         = lazy(() => import("./pages/BlogDetailPage"));

// Student — one dynamic chunk
const StudentLayout       = lazy(() => import("./components/layout/StudentLayout"));
const StudentDashboard    = lazy(() => import("./pages/student/StudentDashboard"));
const CoursePlayerPage    = lazy(() => import("./pages/student/CoursePlayerPage"));
const MyCoursesPage       = lazy(() => import("./pages/student/MyCoursesPage"));
const StudentProfilePage  = lazy(() => import("./pages/student/StudentProfilePage"));
const CertificatePage     = lazy(() => import("./pages/student/CertificatePage"));
const ReviewsPage         = lazy(() => import("./pages/student/ReviewPage"));
const MyRefundPage        = lazy(() => import("./pages/student/MyRefundPage"));

// Creator — one dynamic chunk
const CreatorLayout       = lazy(() => import("./components/layout/CreatorLayout"));
const CreatorDashboard    = lazy(() => import("./pages/creator/CreatorDashboard"));
const MyCourses           = lazy(() => import("./pages/creator/MyCourses"));
const CourseBuilder       = lazy(() => import("./pages/creator/CourseBuilder"));
const LessonEditor        = lazy(() => import("./pages/creator/LessonEditor"));
const QuizBuilder         = lazy(() => import("./pages/creator/QuizBuilder"));
const AssignmentBuilder   = lazy(() => import("./pages/creator/AssignmentBuilder"));
const SubmissionsPage     = lazy(() => import("./pages/creator/SubmissionsPage"));
const CreatorAnalytics    = lazy(() => import("./pages/creator/CreatorAnalytics"));
const CreatorWallet       = lazy(() => import("./pages/creator/CreatorWallet"));
const CouponManager       = lazy(() => import("./pages/creator/CouponManager"));
const CertificateManager  = lazy(() => import("./pages/creator/CertificateManager"));
const CreatorProfilePage  = lazy(() => import("./pages/creator/CreatorProfilePage"));

// Admin — one dynamic chunk
const AdminLayout           = lazy(() => import("./components/layout/AdminLayout"));
const AdminDashboard        = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement        = lazy(() => import("./pages/admin/UserManagement"));
const CourseManagement      = lazy(() => import("./pages/admin/CourseManagement"));
const CourseApprovals       = lazy(() => import("./pages/admin/CourseApprovals"));
const CategoryManagement    = lazy(() => import("./pages/admin/CategoryManagement"));
const RevenueReports        = lazy(() => import("./pages/admin/RevenueReports"));
const PlatformSettings      = lazy(() => import("./pages/admin/PlatformSettings"));
const AdminWallets          = lazy(() => import("./pages/admin/AdminWallets"));
const InternshipManagement  = lazy(() => import("./pages/admin/InternshipManagement"));
const HeroImageManager      = lazy(() => import("./pages/admin/HeroImageManager"));
const AdminRefundPage       = lazy(() => import("./pages/admin/AdminRefundPage"));
const AdminIssueCertificate = lazy(() => import("./pages/admin/AdminIssueCertificate"));
const AdminProfilePage      = lazy(() => import("./pages/admin/AdminProfilePage"));
const ReviewApprovalsPage   = lazy(() => import("./pages/admin/ReviewApprovalsPage"));
const AdminBlogPage         = lazy(() => import("./pages/admin/AdminBlogPage"));

// ─────────────────────────────────────────────────────────────────────────────
// LOADING FALLBACKS
// ─────────────────────────────────────────────────────────────────────────────

/** Full-screen spinner — shown while the session is being resolved */
// const SessionLoader = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//     <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//   </div>
// );

/** Lightweight inline spinner — shown while a lazy page chunk loads */
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="flex flex-col items-center">
      <img
        src="/logo.png"
        alt="Loading"
        className="w-14 h-14 object-contain animate-bounce"
      />
      <div className="mt-2 w-8 h-1.5 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 animate-pulse" />
    </div>
    <p className="mt-6 text-xs tracking-widest uppercase text-gray-400 dark:text-white/30 font-medium">
      Loading...
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC LAYOUT — wraps fully-public pages with Navbar + Footer
// ─────────────────────────────────────────────────────────────────────────────
const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const dispatch       = useDispatch();
  const isInitialized  = useSelector(selectIsInitialized);
  const isAuthenticated= useSelector(selectIsAuthenticated);
  const user           = useSelector(selectUser);

  useAdminSessionGuard();

  if (!isInitialized) return <SplashScreen />;

  return (
    <>
      <ScrollToTop />
      {/* <Suspense fallback={<PageLoader />}> */}
        <Routes>

          {/* ── Fully public pages — WITH Navbar + Footer ─────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/"                        element={<LandingPage />} />
            <Route path="/unauthorized"            element={<UnauthorizedPage />} />
            <Route path="/verify-email/:token"     element={<VerifyEmailPage />} />
            <Route path="/techmind-courses"        element={<CoursesLandingPage />} />
            <Route path="/about"                   element={<AboutUs />} />
            <Route path="/internships"             element={<InternshipsPage />} />
            <Route path="/profile"                 element={<ProfileModal />} />
            <Route path="/certificate-purchase"    element={<CertificatePurchasePage />} />
            <Route path="/services"                element={<Service />} />
            <Route path="/refund"                  element={<RefundPolicyPage />} />
            <Route path="/privacy"                 element={<PrivacyPolicyPage />} />
            <Route path="/blogs"                   element={<BlogsPage />} />
            <Route path="/blogs/:slug"             element={<BlogDetailPage />} />
          </Route>

          {/* ── Auth pages: redirect away if already logged in ────────────── */}
          {/* No Navbar/Footer — auth pages are standalone */}
          <Route element={<PublicRoute />}>
            <Route path="/auth"                      element={<AuthPage />} />
            <Route path="/forgot-password"           element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token"     element={<ResetPasswordPage />} />
          </Route>

          {/* ── Student routes ────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard"                              element={<StudentDashboard />} />
              <Route path="/student/my-courses"                             element={<MyCoursesPage />} />
              <Route path="/student/learn/:courseId"                        element={<CoursePlayerPage />} />
              <Route path="/student/learn/:courseId/lesson/:lessonId"       element={<CoursePlayerPage />} />
              <Route path="/student/certificate/:courseId"                  element={<CertificatePage />} />
              <Route path="/student/profile"                                element={<StudentProfilePage />} />
              <Route path="/courses"                                        element={<CourseCataloguePage />} />
              <Route path="/courses/:slug"                                  element={<CourseDetailPage />} />
              <Route path="/reviews"                                        element={<ReviewsPage />} />
              <Route path="/student/refunds"                                element={<MyRefundPage />} />
            </Route>
          </Route>

          {/* ── Creator routes ────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["creator"]} />}>
            <Route element={<CreatorLayout />}>
              <Route path="/creator/dashboard"                                          element={<CreatorDashboard />} />
              <Route path="/creator/courses"                                            element={<MyCourses />} />
              <Route path="/creator/courses/new"                                        element={<CourseBuilder />} />
              <Route path="/creator/courses/:courseId/edit"                             element={<CourseBuilder />} />
              <Route path="/creator/courses/:courseId/lessons/:lessonId"                element={<LessonEditor />} />
              <Route path="/creator/courses/:courseId/quiz/:lessonId"                   element={<QuizBuilder />} />
              <Route path="/creator/courses/:courseId/assignment/:lessonId"             element={<AssignmentBuilder />} />
              <Route path="/creator/submissions"                                        element={<SubmissionsPage />} />
              <Route path="/creator/analytics"                                          element={<CreatorAnalytics />} />
              <Route path="/creator/wallet"                                             element={<CreatorWallet />} />
              <Route path="/creator/coupons"                                            element={<CouponManager />} />
              <Route path="/creator/certificates"                                       element={<CertificateManager />} />
              <Route path="/creator/profile"                                            element={<CreatorProfilePage />} />
            </Route>
          </Route>

          {/* ── Admin routes ──────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard"                                            element={<AdminDashboard />} />
              <Route path="/admin/users"                                                element={<UserManagement />} />
              <Route path="/admin/courses"                                              element={<CourseManagement />} />
              <Route path="/admin/course-approvals"                                     element={<CourseApprovals />} />
              <Route path="/admin/categories"                                           element={<CategoryManagement />} />
              <Route path="/admin/revenue"                                              element={<RevenueReports />} />
              <Route path="/admin/settings"                                             element={<PlatformSettings />} />
              <Route path="/admin/wallets"                                              element={<AdminWallets />} />
              <Route path="/admin/internships"                                          element={<InternshipManagement />} />
              <Route path="/admin/hero-images"                                          element={<HeroImageManager />} />
              <Route path="/admin/refunds"                                              element={<AdminRefundPage />} />
              <Route path="/admin/issue-certificate"                                    element={<AdminIssueCertificate />} />
              <Route path="/admin/profile"                                              element={<AdminProfilePage />} />
              <Route path="/admin/preview/:slug"                                        element={<CourseDetailPage />} />
              <Route path="/admin/preview/learn/:courseId"                             element={<CoursePlayerPage />} />
              <Route path="/admin/preview/learn/:courseId/lesson/:lessonId"            element={<CoursePlayerPage />} />
              <Route path="/admin/review-approvals"                                     element={<ReviewApprovalsPage />} />
              <Route path="/admin/blogs"                                                element={<AdminBlogPage />} />
            </Route>
          </Route>

          {/* ── Catch-all ─────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      {/* </Suspense> */}
    </>
  );
}

export default App;