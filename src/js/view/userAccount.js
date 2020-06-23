import "../../css/index.css";
import "../../tags/userAccount.tag";
import riot from "riot";
import Chart from "chart.js";
import view from "../view";
import { initModal } from "../../mx";
import controller from "../controller";

const userAccount = async (userEmail) => {
    //get personal information
    const userInfo = await controller.users.getUserInfoWithEmail(userEmail);
    const classNamesFirebase = await controller.users.retrieveClassesOfUser(
        userInfo.id
    );

    const opts = {
        ...userInfo,
        classNamesFirebase,
        userEmail,
    };

    //mount page
    const userAccountPage = riot.mount("div#root", "useraccount", opts);

    //add event to header
    view.header();

    //chart
    var scores = [];
    var oldTestNames = [];
    if (userInfo.data.oldTests) {
        scores = userInfo.data.oldTests.map((oldTest) => {
            return oldTest.score;
        });
        oldTestNames = userInfo.data.oldTests.map((oldTest) => {
            return oldTest.name;
        });
    }

    const resultChartContainer = document.getElementById("result-chart");
    const ctx = resultChartContainer.getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: oldTestNames,
            datasets: [
                {
                    label: "Scores of exercises",
                    data: scores,
                    borderColor: "rgba(3, 132, 252, 1)",
                    borderWidth: 1,
                    backgroundColor: "rgba(0, 191, 255, 0.2)",
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            max: 100,
                        },
                    },
                ],
            },
        },
    });

    //render materials' images
    const materialImgs = document.getElementsByClassName("material-imgs");
    for (let img of materialImgs) {
        const materialName = img.getAttribute("testName").split(" -")[0];
        const materialInfo = await controller.materials.getMaterialInfoWithMaterialName(
            materialName
        );
        img.setAttribute("src", materialInfo.data.fileUrls);
    }

    //redirect to classes
    const classNames = document.getElementsByClassName("class-name");
    for (let className of classNames) {
        className.addEventListener("click", (e) => {
            const name = e.target.value;
            window.location.href = `/classInfoStudent?className=${name}`;
        });
    }

    //init delete modal
    const deleteModal = initModal(document.getElementById("delete-modal"));

    //delete account btn
    const deleteAccountBtn = document.getElementById("delete-btn");
    deleteAccountBtn.addEventListener("click", (e) => {
        deleteModal.open();
    });

    //confirm and unconfirm delete account btn
    const unconfirmDeleteAccountBtn = document.getElementById(
        "unconfirm-delete-btn"
    );
    unconfirmDeleteAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();

        deleteModal.close();
    });
    const confirmDeleteAccountBtn = document.getElementById(
        "confirm-delete-btn"
    );
    confirmDeleteAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();

        controller.users.deleteAccount(userEmail);
        window.location.href = "/signup";
    });
};

export { userAccount };
