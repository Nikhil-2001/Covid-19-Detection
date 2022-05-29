
var input1;
var predicted_class;

const classes = {
'COVID' : 0,'Lung Opacity' :1,'Normal' : 2,'Viral Pneumonia' :3
};

const causes = {
    "Bacterial spot is caused by Xanthomonas campestris pv. vesicatoria and is the most common and destructive disease for peppers.": 0, "The pepper-bell plant is healthy.": 1, "Early blight is caused by the fungus Alternaria solani. The disease primarily affects leaves and stems, but under favorable weather conditions, and if left uncontrolled, it can result in considerable defoliation and enhance the chance for tuber infection. Premature defoliation may lead to a reduction in yield.": 2,
    "Late blight, also called potato blight, caused by Phytophthora infestans is an oomycete or water mold, a fungus-like microorganism. The disease occurs in humid regions with temperatures ranging between 4 and 29 °C (40 and 80 °F). Hot and dry weather checks its spread. Potato plants that are infected may rot within two weeks.": 3,
};

const symptoms = {"Bacterial spot disease symptoms can appear throughout the above-ground portion of the plant, which may include leaf spot, fruit spot, and stem canker. However, early symptoms show up as water-soaked lesions on leaves that can quickly change from green to dark brown and enlarge into spots that are up to 1/4 inch in diameter with slightly raised margins. Over time, these spots can dry up in less humid weather, which allows the damaged tissues to fall off, resulting in a tattered appearance on the affected leaves.": 0,
"There are no symptoms as the pepper bell plant is healthy.": 1,
"Early blight disease symptoms appear first on the oldest foliage. Diseased leaves have circular to angular dark brown lesions 0.12 to 0.16 inches (3 – 4 mm) in diameter. Concentric rings often form in lesions to produce a characteristic target-board effect. Severely infected leaves turn yellow and drop. Infected tubers show a brown corky dry rot.": 2,
"Late blight disease symptoms will first appear as water-soaked spots, usually at the tips or edges of lower leaves where water or dew tends to collect. In moist and cool conditions, water-soaked spots rapidly enlarge and a broad yellow halo may be seen surrounding the lesion. On the underside of a leaf, a spore-producing zone of white moldy growth approximately 0.1 - 0.2 inches wide may appear at the border of the lesion. In wet conditions, the disease progress rapidly, and warm, dry weather will slow or stop disease development. As conditions become moist and cool, disease development resumes. Tuber lesions first appear as irregular, dark blotches. When cut open, the affected tissue is water-soaked, reddish-brown, and extends with an irregular margin into the tuber flesh. Lesions may start as superficial decay that continues to develop after tubers are harvested and placed into storage. Older lesions may become firm and sunken due to water loss and tubers will appear shriveled.": 3,
};

const treatments = [["Washing seeds for 40 minutes in diluted Clorox (two parts Clorox plus eight parts water).", "Seed treatment with hot water, soaking seeds for 30 minutes in water pre-heated to 125 F/51 C.", "Organic growers should use a combination of copper and Regalia sprays. Apply on a 7 to 10 days schedule, use the shorter interval when rain, high humidity, and warm temperatures occur and the longer in case of dry weather.", "In the field, use at least a three-year rotation because the pathogen can survive in infested crop debris until it completely decomposes"], 
["There is no need for treatment as the plant is healthy."], 
["Plant more potato varieties that are resistant to the disease,"],[" late maturing is more resistant than early maturing varieties.", "Avoid overhead irrigation and allow for sufficient aeration between plants to allow the foliage to dry as quickly as possible. Practice a 2-year crop rotation (Do not replant potatoes or other crops in this family for 2 years after a potato crop has been harvested).", "Keep the potato plants healthy and stress-free by providing adequate nutrition and sufficient irrigation, especially later in the growing season after flowering when plants are most susceptible to the disease.", "Only dig the tubers up when they are completely mature to prevent damaging them. Any damage done at harvest can additionally facilitate the disease.", "Remove plant debris and weed hosts at the end of the season to mitigate areas where the disease may overwinter."], 
];

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// const predictbtn = document.querySelector("#hidebtn");
// predictbtn.addEventListener("click", function () {
//     console.log("Predicted class from btn: " + predicted_class);
// });

const image_input1 = document.querySelector("#imageFile");
image_input1.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        input1 = uploaded_image;
        loadModelAndPredict(input1);
        // document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
});

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(tf.browser.fromPixels(img));
        img.onerror = (err) => reject(err);
    });
}

function resizeImage(image) {
    return tf.image.resizeBilinear(image, [224, 224]);
}

function batchImage(image) {
    // Expand our tensor to have an additional dimension, whose size is 1  
    const batchedImage = image.expandDims(0);
    // Turn pixel data into a float between 0 and 1.  
    return batchedImage.toFloat().div(tf.scalar(255));
}

function loadAndProcessImage(image) {
    const resizedImage = resizeImage(image);
    console.log(image);
    const batchedImage = batchImage(resizedImage);
    return batchedImage;
}

function loadModelAndPredict(image) {
    tf.loadLayersModel('./model.json').then(pretrainedModel => {
        loadImage(image).then(img => {
            const processedImage = loadAndProcessImage(img);
            const prediction = pretrainedModel.predict(processedImage);
            // Because of the way Tensorflow.js works, you must call print on a Tensor instead of console.log.    
            prediction.print();
            const result = prediction.as1D().argMax().dataSync()[0];
            console.log(result);
            //c,gg,nor,vn
            predicted_class = getKeyByValue(classes, result);
            console.log(predicted_class);
            var diagnosisResult = "Your X-Ray scan has been diagnosed as " +predicted_class;
            let d = document.querySelector('#diagnosis').innerHTML;
            console.log(d)
            document.querySelector('#diagnosis').innerHTML = diagnosisResult
            document.querySelector("#hidebtn").innerHTML = "PREDICT";
            document.querySelector("#hidebtn").style.pointerEvents = "all";

            document.querySelector("#prediction").innerHTML = predicted_class;
            document.querySelector("#cause").innerHTML = getKeyByValue(causes, result);
            document.querySelector("#symptom").innerHTML = getKeyByValue(symptoms, result);
            const treat = document.querySelector("#treatment");
            treat.innerHTML = "";
            const treat_res = treatments[result];
            const ul = document.createElement("ul");
            treat.appendChild(ul);
            for(let i=0; i<treat_res.length; i++) {
                const li = document.createElement("li");
                li.innerHTML = treat_res[i];
                ul.appendChild(li);
            }
        });
    });
}