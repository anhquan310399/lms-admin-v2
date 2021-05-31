import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Dashboard = React.lazy(() => import('./App/pages/DashBoard/index'));

const SubjectManager = React.lazy(() => import('./App/pages/SubjectManager'));

const UserManager = React.lazy(() => import('./App/pages/UserManager'));

const SemesterManager = React.lazy(() => import('./App/pages/SemesterManager'));

const FacultyManager = React.lazy(() => import('./App/pages/FacultyManager'));

const CurriculumManager = React.lazy(() => import('./App/pages/CurriculumManager'));

const ClassManager = React.lazy(() => import('./App/pages/ClassManager'));

const CourseManager = React.lazy(() => import('./App/pages/CourseManager'));


const routes = [
    { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/semester', exact: true, name: 'Semester Manager', component: SemesterManager },
    { path: '/faculty', exact: true, name: 'Faculty Manager', component: FacultyManager },
    { path: '/course', exact: true, name: 'Course Manager', component: CourseManager },
    { path: '/curriculum', exact: true, name: 'Curriculum Manager', component: CurriculumManager },
    { path: '/class', exact: true, name: 'Class Manager', component: ClassManager },
    { path: '/subject', exact: true, name: 'Subject Manager', component: SubjectManager },
    { path: '/manager/teacher', exact: true, name: 'Manager', component: UserManager },
    { path: '/manager/student', exact: true, name: 'Manager', component: UserManager },
    { path: '/manager/register', exact: true, name: 'Manager', component: UserManager },
];

export default routes;