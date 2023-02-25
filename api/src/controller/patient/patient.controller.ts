import express from "express";
import * as patientService from "../../service/patient.service";
import * as userService from "../../service/user.service";
const patientRouter = express.Router();

patientRouter.post("/assessment", async (req, res) => {
  try {
    const { patient_id, details, answers } = req.body;

    const user = await userService.findUserById(patient_id);
    if (!user) {
      return res.status(404).send("User record not found");
    }

    const assessment = await patientService.createPatientAssessment(
      patient_id,
      user,
      details,
      answers
    );

    res.status(201).json({ assessment });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create assessment");
  }
});

patientRouter.put("/assessment/:assessment_Id/accept", async (req, res) => {
  const { assessment_Id } = req.params;

  try {
    const assessment = await patientService.acceptAssessmentByPatient(
      assessment_Id
    );
    res.status(200).json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to cancel assessment");
  }
});

patientRouter.put("/assessment/:assessment_Id/cancel", async (req, res) => {
  const { assessment_Id } = req.params;

  try {
    const assessment = await patientService.cancelAssessmentByPatient(
      assessment_Id
    );
    res.status(200).json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to cancel assessment");
  }
});

patientRouter.get("/appointment/:patient_id", async (req, res) => {
  const { patient_id } = req.params;

  try {
    const appointment = await patientService.findAppointmentByPatient(
      patient_id
    );
    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to fetch appointment");
  }
});

patientRouter.put("/appointment/:appointment_Id/accept", async (req, res) => {
  const { appointment_Id } = req.params;

  try {
    const appointment = await patientService.acceptAppointmentByPatient(
      appointment_Id
    );
    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to accept appointment");
  }
});

patientRouter.put("/appointment/:appointment_Id/cancel", async (req, res) => {
  const { appointment_Id } = req.params;

  try {
    const appointment = await patientService.cancelAppointmentByPatient(
      appointment_Id
    );
    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to cancel appointment");
  }
});

export default patientRouter;
