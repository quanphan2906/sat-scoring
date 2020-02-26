//import libraries
import route from "riot-route";

//import js
import view from "./js/view";
import controller from "./js/controller";

controller.firebaseInit();

route.base("/");

route("/", () => {controller.users.assistantCheckIn(view.overview)})

route("/signup..", () => {view.signup()})

route("/signin..", () => {view.login()})

route("/userAccount..", () => {controller.users.userCheckIn(view.userAccount)})

route("/classInfoStudent..", () => {controller.users.userCheckIn(view.classInfoStudent);})

route("/submit..", () => {controller.users.userCheckIn(view.submit)})

route("/overview", () => {controller.users.assistantCheckIn(view.overview)})

route("/upload", () => {controller.users.assistantCheckIn(view.upload)});

route('/materials', () => {controller.users.assistantCheckIn(view.materials)})

route("/classInfoAssistant..", () => {controller.users.assistantCheckIn(view.classInfoAssistant)})

route("/materialInfo..", () => controller.users.assistantCheckIn(view.materialInfo))

route.start(true);