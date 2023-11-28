import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ContactForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      subject: "",
      email: "",
      phone: "",
      message: "",
      subscribe: false,
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Subject is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(
          /^\+?(972|0)?0?([5]{1}[0-9]{1}(\-)?\d{7})$/,
          "Phone number is invalid"
        )
        .required("Phone is required"),
      message: Yup.string()
        .min(5, "Message should be at least 5 characters")
        .required("Message is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/submit-form`,
          values
        );

        console.log("API response:", response.data);

        handleSnackbarOpen("success", "Form submitted successfully");
        formik.resetForm();
      } catch (error) {
        console.error("API request failed:", error);

        handleSnackbarOpen(
          "error",
          error.response && error.response.status === 429
            ? "Too many requests, please try again later."
            : "Failed to submit form"
        );
      }
    },
  });

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h4">Contact us</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="subject"
          name="subject"
          label="*Subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject && Boolean(formik.errors.subject)}
          helperText={formik.touched.subject && formik.errors.subject}
          margin="normal"
        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label="*Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        <TextField
          fullWidth
          id="phone"
          name="phone"
          label="*Phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          margin="normal"
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          id="message"
          name="message"
          label="*Message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
          margin="normal"
        />
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                id="subscribe"
                name="subscribe"
                checked={formik.values.subscribe}
                onChange={formik.handleChange}
                color="primary"
              />
            }
            label="I'd like to receive product tips and updates"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "right", marginTop: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!(formik.isValid && formik.dirty)}
          >
            Submit
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactForm;
