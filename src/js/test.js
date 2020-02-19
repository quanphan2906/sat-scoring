await db.collection("classes").doc(classInfo.id).update({
    'students.data[0]': studentData, 
})