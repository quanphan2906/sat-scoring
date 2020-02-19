<materialinfo>
    <div id="submit-header" class="flex-row border-standard" style="margin-bottom: 48px;">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">Thầy Julius</div>
            <div class="font-14px">Luyện thi SAT & IELTS với chất lượng tốt nhất</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 400px; margin-bottom: 8px">
            <img src="../assets/students.png" alt="" width="50px" height="auto" style="margin-right: 24px;">
            <div id="email" style="margin-top: 12px;">{opts.userEmail}</div>
            <button id="sign-out" class="margin-left-24px" style="margin-top: 4px;">Sign out</button>
        </div>
    </div>

    <div class="flex-space-evenly">
        <div>
            <div class="flex-center-row">
                <div class="font-20px text-center">{opts.name}</div>
                <i id="update-name" class="fas fa-times fit-content" style="color: #000; margin-top: 9px; margin-left: 12px;"></i>
            </div>
            <div class="flex-center-row">
                <div class="font-16px text-center"><i>Type: {opts.type}</i></div>
                <i id="update-type" class="fas fa-times fit-content" style="color: #000; margin-top: 7px; margin-left: 12px;" change="type"></i>
            </div>
            <div style="margin-bottom: 72px;" class="flex-row">
                <div each="{section in opts.sections}" class="flex-row">
                    <button class="section-option margin-left-12px margin-top-12px flex-row">{section.sectionName}</button>
                    <i class="update-section fas fa-times fit-content" style="color: #000; margin: 23px 4px 0px 4px;"></i>
                </div>
            </div>
            <div class="flex-center-row">
                <button id="add-section" class="btn-primary center">Add section</button>
            </div>
        </div>
        <div>
            <img src="{opts.fileUrls}" alt="" width="300px" height="300px">
        </div>
    </div>

    <div class="line" style="margin-top: 24px;"></div>

    <form id="number-of-questions-input" class="flex-center-row margin-top-24px"></form>

    <div class="margin-top-24px">
        <div class="text-center font-20px">{opts.type}</div>
        <div id="key-list-container" class="flex-row center text-center" style="margin: 12px 72px 0px 72px"></div>
    </div>

    <div id="update-button-container" class="flex-center margin-top-24px">
        <button id="update-btn" class="center btn-primary">Update answers</button>
    </div>

    <div class="flex-center mx-modal" id="update-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
                <form action="" class="flex-col" id="update-form"></form>
            </div>
        </div>
    </div>

</materialinfo>