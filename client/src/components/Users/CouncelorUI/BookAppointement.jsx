import { Button, Form, Select, DatePicker, notification } from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function BookAppointment() {
  const { currentUser } = useSelector((state) => state.user);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [id, setId] = useState(0);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${currentUser.access_token}` }),
    [currentUser.access_token]
  );

  const appointmentNotification = () => {
    notification.open({
      message: "Your appointment has been successfully booked!",
      placement: "top",
    });
  };
  const errorNotification = () => {
    notification.open({
      message: "It seems there was an error when trying to book an appointment",
      placement: "top",
    });
  };

  const duplicateNotification = () => {
    notification.open({
      message: "Sorry, you already have an appointment at this time",
      placement: "top",
    });
  };

  const handleDateChange = (date) => {
    let newDate = new Date(date);
    newDate.setHours(newDate.getHours() - 4, newDate.getMinutes(), 0, 0);
    setDate(newDate);
  };

  const getAppointments = async () => {
    await axios
      .get("/counselor/appointment", { headers })
      .then((response) => response)
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getPatients = async () => {
    await axios
      .get("/counselor/patients", { headers })
      .then((response) => response)
      .then((res) => {
        setPatients(res.data);
      })
      .catch((error) => console.log(error));
  };

  const hasDuplicateTime = async (appointment) => {
    for (const element of appointments) {
      const convDate1 = new Date(element.appointment_date).toISOString();
      const convDate2 = appointment.appointmentDate.toISOString();
      if (convDate1 === convDate2) {
        return true;
      }
    }
    return false;
  };

  const createAppointment = async (appointment) => {
    await axios.post("/counselor/appointment", appointment, {
      headers,
    });
    await getAppointments();
  };

  const handleAppointment = async () => {
    await getAppointments();
    try {
      let appointment = {
        patient_Id: parseInt(id.key),
        medicalStaff_Id: currentUser.user_id,
        appointmentDate: date,
      };

      if (appointments.length === 0) {
        createAppointment(appointment);
        appointmentNotification();
      } else {
        if (await hasDuplicateTime(appointment)) {
          duplicateNotification();
        } else {
          createAppointment(appointment);
          appointmentNotification();
        }
      }
    } catch (error) {
      errorNotification();
    }
  };

  useEffect(() => {
    getPatients();
    getAppointments();
  }, []);

  const formRef = React.useRef(null);
  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      style={{
        maxWidth: 600,
        marginTop: 50,
      }}
    >
      <Form.Item
        name="date"
        label="Select Date & Time"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker
          showTime
          minuteStep={15}
          hourStep={1}
          format="YYYY/MM/DD HH:mm"
          onChange={handleDateChange}
          value={date}
        />
      </Form.Item>
      <Form.Item
        name="patient"
        label="Patient"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          onChange={(value, key) => {
            setId(key);
            setPatient(value);
          }}
        >
          {patients.map((patient) => (
            <Select.Option key={patient.patient_id} value={patient.user.name}>
              {patient.user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={handleAppointment}>
          Book
        </Button>
      </Form.Item>
    </Form>
  );
}
