import { createRouter, createWebHistory } from "vue-router";
import EmptyRouterView from "@/pages/EmptyRouterView.vue";
import LoginPage from "@/pages/LoginPage.vue";
import HomePage from "@/pages/HomePage.vue";
import PreTestPage from "@/pages/PreTestPage.vue";
import MidTestPage from "@/pages/MidTestPage.vue";
import PostTestPage from "@/pages/PostTestPage.vue";
import QuestionPage from "@/pages/QuestionPage.vue";
import AdminPage from "@/pages/AdminPage.vue";
import { QuestionType, TestPhase } from "@/global";
import { getPhaseDoneStatus } from "@/utils/common";

const routes = [
  // ========================== First Time Login Page ==========================
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    beforeEnter: () => {
      if (localStorage.getItem("id") !== null) return { name: "home" };
    },
  },
  // ========================== Home Page ==========================
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: HomePage,
  },
  // ========================== Pre-Test Page ==========================
  {
    path: "/pre-test",
    component: EmptyRouterView,
    children: [
      {
        path: "",
        name: "preTest",
        component: PreTestPage,
      },
      {
        path: "choice:questionIndex",
        name: "preTestChoice",
        component: QuestionPage,
        props: (route: any) => {
          return {
            testPhase: TestPhase.Pre,
            questionType: QuestionType.Choice,
            questionIndex: Number(route.params.questionIndex) - 1,
          };
        },
      },
      {
        path: "matching:questionIndex",
        name: "preTestMatching",
        component: QuestionPage,
        props: (route: any) => {
          return {
            testPhase: TestPhase.Pre,
            questionType: QuestionType.Matching,
            questionIndex: Number(route.params.questionIndex) - 1,
          };
        },
      },
    ],
  },
  // ========================== Mid-Test Page ==========================
  {
    path: "/mid-test",
    component: EmptyRouterView,
    beforeEnter: async () => {
      const { preTestDone } = await getPhaseDoneStatus()
      if (!preTestDone) return { name: 'home' }
    },
    children: [
      {
        path: "",
        name: "midTest",
        component: MidTestPage,
      },
      {
        path: "video:groupIndex/question:questionIndex",
        name: "midTestVideo",
        component: QuestionPage,
        props: (route: any) => {
          return {
            testPhase: TestPhase.Mid,
            questionType: QuestionType.Video,
            groupIndex: Number(route.params.groupIndex) - 1,
            questionIndex: Number(route.params.questionIndex) - 1,
          };
        },
      },
    ],
  },
  // ========================== Post-Test Page ==========================
  {
    path: "/post-test",
    component: EmptyRouterView,
    beforeEnter: async () => {
      const { preTestDone, midTestDone } = await getPhaseDoneStatus()
      if (!preTestDone || !midTestDone) return { name: 'home' }
    },
    children: [
      {
        path: "",
        name: "postTest",
        component: PostTestPage,
      },
      {
        path: "choice:questionIndex",
        name: "postTestChoice",
        component: QuestionPage,
        props: (route: any) => {
          return {
            testPhase: TestPhase.Post,
            questionType: QuestionType.Choice,
            questionIndex: Number(route.params.questionIndex) - 1,
          };
        },
      },
      {
        path: "matching:questionIndex",
        name: "postTestMatching",
        component: QuestionPage,
        props: (route: any) => {
          return {
            testPhase: TestPhase.Post,
            questionType: QuestionType.Matching,
            questionIndex: Number(route.params.questionIndex) - 1,
          };
        },
      },
    ],
  },
  // ========================== Admin Page ==========================
  {
    path: "/admin",
    name: "admin",
    component: AdminPage,
  },
  // ========================== Error Page ==========================
  {
    path: "/:pathMatch(.*)",
    component: () => import("@/pages/NotFoundPage.vue"),
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, _) => {
  const id = localStorage.getItem("id");
  if (id === null && to.name !== "login" && to.name !== 'admin') {
    return { name: "login" };
  }
});

export default router;
