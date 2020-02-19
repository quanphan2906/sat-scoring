//import libraries
import './mx.css';
import route from "riot-route";
import riot from 'riot';

//import tags
import "./tags/signin.tag";
import "./tags/signup.tag";
import "./tags/submit.tag";
import "./tags/userAccount.tag";
import "./tags/upload.tag";
import "./tags/overview.tag";
import "./tags/classInfoAssistant.tag";
import "./tags/classInfoStudent.tag";
import "./tags/materials.tag";
import "./tags/materialInfo.tag";

//import css
import "./css/skeleton-css/normalize.css";
import "./css/skeleton-css/skeleton.css"
import "./css/index.css";
import "./css/signup.css";
import "./css/signin.css";
import "./css/submit.css";
import "./css/userAccount.css";
import "./css/upload.css";
import "./css/overview.css";
import "./css/classInfoAssistant.css";
import "./css/materials.css";

//import js
import "./js/initializeFirebase.js";
import {createFirebaseData} from "./js/createFirebaseData.js";
import {view} from "./js/view.js";
import {controller} from "./js/controller.js";

route.base("/");

route("/", () => {controller.assistantCheckIn(view.overview)})

route("/signup", () => {view.signup()})

route("/signin", () => {view.login()})

route("/userAccount..", () => {controller.userCheckIn(view.userAccount)})

route("/classInfoStudent..", () => {controller.userCheckIn(view.classInfoStudent);})

route("/submit..", () => {controller.userCheckIn(view.submit)})

route("/overview", () => {controller.assistantCheckIn(view.overview)})

route("/upload", () => {controller.assistantCheckIn(view.upload)});

route('/materials', () => {controller.assistantCheckIn(view.materials)})

route("/classInfoAssistant..", () => {controller.assistantCheckIn(view.classInfoAssistant)})

route("/materialInfo..", () => controller.assistantCheckIn(view.materialInfo))

route.start(true);