import { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";

import {
  selectIsInitialized,
  selectIsAuthenticated,
  selectUser,
} from "./store/slices/authSlice";

import { useAdminSessionGuard } from "./hooks/useAdminSessionGaurd";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/ui/SplashScreen";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StudentLayout from "./components/layout/StudentLayout";
import CreatorLayout from "./components/layout/CreatorLayout";
import AdminLayout from "./components/layout/AdminLayout";

// ─────────────────────────────────────────────────────────────────────────────
// LAZY IMPORTS WITH PREFETCH
// ─────────────────────────────────────────────────────────────────────────────

// Auth
const AuthPage             = lazy(() => import(/* webpackPrefetch: true */ "./pages/auth/AuthPage"));
const ForgotPasswordPage   = lazy(() => import(/* webpackPrefetch: true */ "./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage    = lazy(() => import(/* webpackPrefetch: true */ "./pages/auth/ResetPasswordPage"));
const VerifyEmailPage      = lazy(() => import(/* webpackPrefetch: true */ "./pages/auth/VerifyEmailPage"));

// Public pages
const LandingPage             = lazy(() => import(/* webpackPrefetch: true */ "./pages/LandingPage"));
const CourseCataloguePage     = lazy(() => import(/* webpackPrefetch: true */ "./pages/CourseCataloguePage"));
const CourseDetailPage        = lazy(() => import(/* webpackPrefetch: true */ "./pages/CourseDetailPage"));
const NotFoundPage            = lazy(() => import(/* webpackPrefetch: true */ "./pages/NotFoundPage"));
const UnauthorizedPage        = lazy(() => import(/* webpackPrefetch: true */ "./pages/UnauthorizedPage"));
const CoursesLandingPage      = lazy(() => import(/* webpackPrefetch: true */ "./pages/CoursesLandingPage"));
const AboutUs                 = lazy(() => import(/* webpackPrefetch: true */ "./pages/AboutUs"));
const InternshipsPage         = lazy(() => import(/* webpackPrefetch: true */ "./pages/InternshipPage"));
const CertificatePurchasePage = lazy(() => import(/* webpackPrefetch: true */ "./pages/CertificatePurchasePage"));
const ProfileModal            = lazy(() => import(/* webpackPrefetch: true */ "./components/ProfileModal"));
const Service                 = lazy(() => import(/* webpackPrefetch: true */ "./pages/Service"));
const RefundPolicyPage        = lazy(() => import(/* webpackPrefetch: true */ "./pages/RefundPolicyPage"));
const PrivacyPolicyPage       = lazy(() => import(/* webpackPrefetch: true */ "./pages/PrivacyPolicyPage"));
const BlogsPage               = lazy(() => import(/* webpackPrefetch: true */ "./pages/BlogsPage"));
const BlogDetailPage          = lazy(() => import(/* webpackPrefetch: true */ "./pages/BlogDetailPage"));

// Student
// const StudentLayout      = lazy(() => import(/* webpackPrefetch: true */ "./components/layout/StudentLayout"));
const StudentDashboard   = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/StudentDashboard"));
const CoursePlayerPage   = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/CoursePlayerPage"));
const MyCoursesPage      = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/MyCoursesPage"));
const StudentProfilePage = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/StudentProfilePage"));
const CertificatePage    = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/CertificatePage"));
const ReviewsPage        = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/ReviewPage"));
const MyRefundPage       = lazy(() => import(/* webpackPrefetch: true */ "./pages/student/MyRefundPage"));

// Creator
// const CreatorLayout      = lazy(() => import(/* webpackPrefetch: true */ "./components/layout/CreatorLayout"));
const CreatorDashboard   = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CreatorDashboard"));
const MyCourses          = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/MyCourses"));
const CourseBuilder      = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CourseBuilder"));
const LessonEditor       = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/LessonEditor"));
const QuizBuilder        = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/QuizBuilder"));
const AssignmentBuilder  = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/AssignmentBuilder"));
const SubmissionsPage    = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/SubmissionsPage"));
const CreatorAnalytics   = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CreatorAnalytics"));
const CreatorWallet      = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CreatorWallet"));
const CouponManager      = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CouponManager"));
const CertificateManager = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CertificateManager"));
const CreatorProfilePage = lazy(() => import(/* webpackPrefetch: true */ "./pages/creator/CreatorProfilePage"));

// Admin
// const AdminLayout           = lazy(() => import(/* webpackPrefetch: true */ "./components/layout/AdminLayout"));
const AdminDashboard        = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/AdminDashboard"));
const UserManagement        = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/UserManagement"));
const CourseManagement      = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/CourseManagement"));
const CourseApprovals       = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/CourseApprovals"));
const CategoryManagement    = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/CategoryManagement"));
const RevenueReports        = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/RevenueReports"));
const PlatformSettings      = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/PlatformSettings"));
const AdminWallets          = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/AdminWallets"));
const InternshipManagement  = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/InternshipManagement"));
const HeroImageManager      = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/HeroImageManager"));
const AdminRefundPage       = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/AdminRefundPage"));
const AdminIssueCertificate = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/AdminIssueCertificate"));
const AdminProfilePage      = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/AdminProfilePage"));
const ReviewApprovalsPage   = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/ReviewApprovalsPage"));
const AdminBlogPage         = lazy(() => import(/* webpackPrefetch: true */ "./pages/admin/AdminBlogPage"));

// ─────────────────────────────────────────────────────────────────────────────
// PAGE LOADER
// ─────────────────────────────────────────────────────────────────────────────
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
// PUBLIC LAYOUT
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
  const dispatch        = useDispatch();
  const isInitialized   = useSelector(selectIsInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user            = useSelector(selectUser);

  useAdminSessionGuard();

  if (!isInitialized) return <SplashScreen />;

  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* ── Public pages — WITH Navbar + Footer ───────────────────────── */}
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

        {/* ── Auth pages ────────────────────────────────────────────────── */}
        <Route element={<PublicRoute />}>
          <Route path="/auth"                    element={<AuthPage />} />
          <Route path="/forgot-password"         element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token"   element={<ResetPasswordPage />} />
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
            <Route path="/admin/preview/learn/:courseId"                              element={<CoursePlayerPage />} />
            <Route path="/admin/preview/learn/:courseId/lesson/:lessonId"             element={<CoursePlayerPage />} />
            <Route path="/admin/review-approvals"                                     element={<ReviewApprovalsPage />} />
            <Route path="/admin/blogs"                                                element={<AdminBlogPage />} />
          </Route>
        </Route>

        {/* ── Catch-all ─────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </>
  );
}

export default App;