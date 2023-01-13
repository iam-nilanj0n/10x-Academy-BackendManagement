const router = require('express').Router();
const classModel = require('../models/classModel');

// Test Case 3 - List out all classes
router.get('/myClass', async (req, res) => {
    try {
        const Class = await classModel.find();

        if (Class) {
            let resArr = [], id, className, studentsCount, resObj;

            for (let i = 0; i < Class.length; i++) {
                id = Class[i]._id;
                className = Class[i].class;
                studentsCount = Class[i].studentsCount;

                resObj = {
                    id: id,
                    class: className,
                    studentsCount: studentsCount
                }
                resArr.push(resObj);
            }

            res.status(200).json({
                classes: resArr
            })

        } else {
            res.status(400).json({
                message: "No classes are present"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "Failure"
        })
    }
})
// Test Case 4 - Get a specific class
router.get('/myClass/:myClassId', async (req, res)=>{
    try {
        const myClassId = req.params.myClassId;

        const Class = await classModel.findById(myClassId);
        if(!Class){
            return res.status(404).json({
                error: "There is no class at that id"
            })
        }
        let resObj;

        resObj ={
            id: Class._id,
            class: Class.class,
            studentsCount: Class.studentsCount
        }

        res.status(200).json(resObj)

    } catch (error) {
        res.status(500).json({
            status:"Failure"
        })
    }
})

// Test Case 5 - Get all students in a specific class

router.get('/myClass/:myClassId/students', async (req, res)=>{
    try {
        const myClassId =  req.params.myClassId;
        const Class = await classModel.findById(myClassId);
        if(!Class){
            return res.status(404).json({
                error: "There is no class at that id"
            })
        }

        res.status(200).json(Class.students);
    } catch (error) {
        res.status(500).json({
            status:"Failure"
        })
    }
})

// Test Case 6 - Get one student details

router.get('/myClass/:myClassId/students/:studentId', async (req, res)=>{
    try {
        const myClassId = req.params.myClassId;
        const studentId = Number(req.params.studentId);

        const Class = await classModel.findById(myClassId);
        if(!Class){
            return res.status(404).json({
                error:"There is no class at that id"
            })
        }

        let studentsArr = Class.students;
        let resObj;
        for(let i=0; i<studentsArr.length; i++){
            if(studentsArr[i].studentId){
                if(studentsArr[i].studentId===studentId){
                    resObj = studentsArr[i]
                }
            }
        }

        if(!resObj){
            return res.status(404).json({
                error:"There is no student of that id"
            })
        }

        res.status(200).json(resObj)
    } catch (error) {
        res.status(500).json({
            status:"Failure"
        })
    }
})
// All post requests are here

//  test case - 2
router.post('/myClass/:myClassId/students', async (req, res) => {
    try {
        const myClassId = req.params.myClassId;
        const Class = await classModel.findById(myClassId);
        let resObj, studentsArr,studentId;
        if (Class) {
            resObj = Class;
            studentsArr = Class.students;
            studentId = studentsArr[studentsArr.length-1].studentId + 1;

            studentsArr.push({
                name: req.body.name,
                classId: req.body.classId,
                studentId 
            })
            resObj.students = studentsArr;

            resObj = await classModel.findByIdAndUpdate(myClassId, resObj, {new:true})
            
            res.status(200).json({
                studentId
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "Failure"
        })
    }
})


// test Case - 1
router.post('/myClass', async (req, res) => {
    try {
        const Class = await classModel.create(req.body);
        const id = Class._id;
        res.status(201).json({
            id
        })
    } catch (error) {
        res.status(500).json({
            status: "Failure"
        })
    }
})

// Delete request starts here

// Test Case 8 - Delete a specified class
router.delete('/myClass/:myClassId', async (req, res)=>{
    try {
        const myClassId = req.params.myClassId;
        const deleteClass =  await classModel.findById(myClassId);
        if(!deleteClass){
            return res.status(404).json({
                error:"There is no task at that id"
            })
        }
        await classModel.findByIdAndDelete(myClassId);
        res.status(204);
    } catch (error) {
        res.status(500).json({
            status:"Failure"
        })
    }
})
// Test Case 9 - Delete a student

router.delete('/myClass/:myClassId/students/:studentId', async (req, res)=>{
    try {
        const myClassId = req.params.myClassId;
        const studentId = req.params.studentId;
        let Class = await classModel.findById(myClassId);

        if(!Class){
            return res.status(404).json({
                error:"There is no task at that id"
            })
        }
        let resObj = Class;
        let studentsArr = resObj.students;
        for(let i=0; i<studentsArr.length; i++){
            if(studentsArr[i].studentId){
                if(studentsArr[i].studentId===studentId){
                    studentsArr.splice(i,1)
                }
            }
        }
        resObj.students = studentsArr;
        // console.log(resObj.students);
        Class = await classModel.findByIdAndUpdate(myClassId, resObj, {new:true})
        res.status(204).json({
            resObj
        })
    } catch (error) {
        res.status(500).json({
            status:"Failure"
        })
    }
})
module.exports = router;