import OrganManager from "@/views/OrganManager.vue";
import admin from "@/views/AdminLayout.vue";

export default [
  // {
  //   path: "",
  //   name: "home",
  //   component: () => import("@/views/MainContent.vue"),
  // },

  // 1) 기관관리자 영역
  {
    path: "/organmanager",
    component: OrganManager,
    children: [
      {
        path: "",
        name: "organmanager-home",
        component: () => import("@/views/organmanager/ApplicantList.vue"),
      },
      {
        path: "managers",
        name: "organmanager-managers",
        component: () => import("@/views/organmanager/ManagerList.vue"),
      },
    ],
  },
  // 2) 시스템관리자 영역
  {
    path: "/admin",
    component: admin,
    children: [
      {
        path: "",
        name: "admin-home",
        component: () => import("@/views/admin/AdminHome.vue"),
      },
      {
        path: "manager-control",
        name: "admin-manager-control",
        component: () => import("@/views/ManagerControl.vue"),
      },
      {
        path: "organ-managers",
        name: "admin-organ-managers",
        component: () => import("@/views/OrganManager.vue"),
      },
      {
        path: "systemSurveyList",
        name: "admin-survey-list",
        component: () => import("@/views/SystemManager_survey.vue"),
      },
      {
        path: "/systemSurveyForm",
        name: "SystemManagerSurveyForm",
        component: () =>
          import("@/views/systemmanager_surveyComp/SurveyForm.vue"),
      },
    ],
  },
];
