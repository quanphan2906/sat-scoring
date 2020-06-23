<upload>
    <div id="upload-header" class="flex-row border-standard">
        <div class="margin-top-12px" style="margin-left: 144px; margin-bottom: 8px">
            <div class="font-Pacifico font-20px">SAT Scoring App</div>
        </div>
        <div class="margin-top-12px flex-row" style="margin-left: 360px; margin-bottom: 8px">
            <img src="../assets/students.png" alt="" width="50px" height="auto" style="margin-right: 24px;">
            <div class="dropdown">
                <div id="email" class="drop-title" style="margin-top: 12px;">{opts.userEmail}</div>
                <div class="dropdown-content">
                    <a href="/upload">Upload materials</a>
                    <a href="/materials">Materials page</a>
                    <a href="/overview">Overview</a>
                </div>
            </div>
            <button id="sign-out" class="margin-left-24px" style="margin-top: 4px;">Sign out</button>
        </div>
    </div>

    <div id="upload-wrapper" style="margin-top: 72px;" class="flex-col">

        <!-- <div class="font-20px margin-bot-12px" style="align-self: center;">Uploading SAT materials? Look no further!</div> -->
        <div style="margin-left: 192px">
            <label for="" class="opacity-50">First, let start with the materials' name</label>
            <div class="flex-row fit-content" style="margin-bottom: 0px;">
                <input class="input" type="text" id="material-name" placeholder="Material's name">
                <button class="btn-primary margin-left-12px">Verify the name</button>
            </div>
            <div id="materialName-error" class="form-error fit-content" style="margin-top: 0px;"></div>
        </div>

        <div id="upload-wrapper" class="flex-row margin-top-24px" style="flex-wrap: nowrap;">
            <div class="flex-col fit-content" style="margin: 24px 0px 0px 48px; width: 40%">
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

                    <label for="" class="opacity-50">Number of the material's sections</label>
                    <input id="number-of-sections" type="number" name="numberOfSections" placeholder="Number of tests/sections" style="margin-bottom: 0px;">
                    <div id="numberOfSections-error" class="form-error fit-content" style="margin-top: 4px"></div>

                    <div class="margin-bot-12px">              
                        <label class="opacity-50" for="">Choose section</label>      
                        <select name="" id="section-option"></select>
                        </select>
                    </div>

                    <div>
                        <label for="" class="opacity-50">Please upload the first page of the material</label>
                        <div>
                            <div class="mx-img-upload" style="width: 100px; height: 100px;"></div>
                        </div>
                        <div id="img-upload-error" class="form-error fit-content"></div>
                    </div>
                </form>
            </div>

            <div class="line-straight" style="margin-left: 48px; margin-right: 48px;"></div>

            <div id="keys-list-wrapper" class="flex-col">
                <div id="section-info" class="flex-row fit-content" style="align-self: center; margin-bottom: 0px;">    
                    <div>               
                        <input type="text" id="key-total" placeholder="Input number of questions">
                    </div>
                    <button id="generate-input" class="btn-primary" style="margin-left: 4px;">Generate</button>
                </div>
                <div class="form-error fit-content" id="key-total-error" style="align-self: center; margin-top: 0px"></div>

                <div class="flex-col">
                    <div id="type-title" class="text-center font-20px" style="align-self: center;">Reading</div>
                    <div id="inputs" class="form-error"></div>
                    <div id="keys-list-container" class="flex-row center margin-top-12px text-center"></div>
                </div>

                <div id="upload-container" class="flex-col">
                    <button id="upload-btn" class="button-primary btn center" style="margin-top: 48px">Upload</button>
                </div>
                <div id="loader" style="align-self: center;"></div>
                
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