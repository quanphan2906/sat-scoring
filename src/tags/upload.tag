<upload>
    <div id="upload-header" class="flex-row border-standard">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">Thầy Julius</div>
            <div class="font-14px">Luyện thi SAT & IELTS với chất lượng tốt nhất</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 360px; margin-bottom: 8px">
            <img src="../assets/students.png" alt="" width="50px" height="auto" style="margin-right: 24px;">
            <div id="email" style="margin-top: 12px;">{opts.userEmail}</div>
            <button class="margin-left-24px" style="margin-top: 4px;">Sign out</button>
        </div>
    </div>

    <div id="upload-wrapper" style="margin-top: 72px;" class="flex-col">

        <!-- <div class="font-20px margin-bot-12px" style="align-self: center;">Uploading SAT materials? Look no further!</div> -->
        <div style="margin-left: 192px">
            <label for="">First, let start with the materials' name</label>
            <div class="flex-row">
                <input class="input" type="text" id="material-name" placeholder="Material's name">
                <button class="btn-primary margin-left-12px">GO</button>
            </div>
        </div>

        <div id="upload-container" class="flex-row margin-top-24px" style="flex-wrap: nowrap;">
            <div class="flex-col fit-content" style="margin: 48px;">
                <form action="" class="flex-col margin-top-12px" id="material-info">

                    <div>
                        <label for="" class="opacity-50">Type of material</label>
                        <select name="" id="type">
                            <option value="Reading">Reading</option>
                            <option value="Writing">Writing</option>
                            <option value="Maths">Maths</option>
                            <option value="Pratice tests">Pratice tests</option>
                        </select>
                    </div>
                    <div class="error margin-bot-24px" id="materialType-error"></div>

                    <input type="number" name="numberOfSections" placeholder="Number of tests/sections">

                    <div class="margin-bot-12px">              
                        <label class="opacity-50" for="">Choose which section to insert answer keys</label>      
                        <select name="" id="section-option"></select>
                    </div>

                    <div>
                        <label for="" class="opacity-80">Please upload the first page of the material</label>
                        <div>
                            <div class="mx-img-upload" style="width: 100px; height: 100px;"></div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="line-straight" style="margin-left: 72px; margin-right: 72px;"></div>

            <div id="keys-list-wrapper">
                <div id="section-info" class="flex-space-evenly">    
                    <div>               
                        <input type="text" id="key-total" placeholder="Input number of questions">
                    </div>
                </div>

                <div class="flex-col">
                    <div id="type-title" class="text-center font-20px" style="align-self: center;">Reading</div>
                    <div id="keys-list-container" class="flex-row center margin-top-12px text-center"></div>
                </div>

                <div class="flex-col">
                    <!-- <progress value="0" max="100" id="upload-progress">0%</progress> -->
                    <button id="upload-btn" class="button-primary btn center" style="margin-top: 48px">Upload</button>
                </div>
                
                <div class="margin-top-12px form-success" id="form-success"></div>
                <div class="margin-top-12px form-error" id="form-error"></div>
            </div>
        </div>
    </div>

    <div class="flex-center mx-modal" id="inform-modal" style="margin: 0 auto;">
        <div id="modal-wrapper" class="fit-content bg-color-white border-standard">
            <div id="modal-container" style="margin: 12px;" class="fit-content">
            </div>
        </div>
    </div>

</upload>