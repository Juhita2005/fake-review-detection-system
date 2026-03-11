import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

function App() {

  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [csvResult, setCsvResult] = useState(null);
  const [reviewLogs, setReviewLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/review-logs");
      setReviewLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const detectReview = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/detect-review",
        null,
        { params: { review: review } }
      );

      setResult(response.data);

      // refresh history after detection
      fetchLogs();

    } catch (error) {
      console.error("Detection error:", error);
    }
  };

  const uploadCSV = async (event) => {

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-csv",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setCsvResult(response.data);

      // refresh logs
      fetchLogs();

    } catch (error) {
      console.error("CSV upload error:", error);
    }
  };

  const downloadResults = () => {

    if (!csvResult) return;

    const csvRows = [
      ["Review", "Prediction", "Fake Probability", "Genuine Probability"]
    ];

    csvResult.results.forEach(r => {
      csvRows.push([
        r.review,
        r.prediction,
        r.fake_probability,
        r.genuine_probability
      ]);
    });

    const csvContent = csvRows.map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "analysis_results.csv";

    a.click();
  };

  return (

    <Container maxWidth="lg" style={{ marginTop: "40px" }}>

      <Typography variant="h3" gutterBottom>
        AI Fake Review Detection System
      </Typography>

      <Grid container spacing={4}>

        {/* Single Review Analyzer */}

        <Grid item xs={12} md={6}>

          <Card elevation={4}>

            <CardContent>

              <Typography variant="h5">
                Single Review Analyzer
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={5}
                margin="normal"
                label="Paste review text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={detectReview}
              >
                Analyze Review
              </Button>

              {result && (

                <Box mt={3}>

                  <Typography>
                    Prediction: <b>{result.prediction}</b>
                  </Typography>

                  <Typography>
                    Fake Probability: {result.fake_probability}
                  </Typography>

                  <Typography>
                    Genuine Probability: {result.genuine_probability}
                  </Typography>

                  <PieChart width={300} height={250}>

                    <Pie
                      data={[
                        { name: "Fake", value: result.fake_probability },
                        { name: "Genuine", value: result.genuine_probability }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >

                      <Cell fill="#ff4d4d" />
                      <Cell fill="#4caf50" />

                    </Pie>

                    <Tooltip />
                    <Legend />

                  </PieChart>

                </Box>

              )}

            </CardContent>

          </Card>

        </Grid>

        {/* CSV Analyzer */}

        <Grid item xs={12} md={6}>

          <Card elevation={4}>

            <CardContent>

              <Typography variant="h5">
                Bulk CSV Review Analyzer
              </Typography>

              <Button
                variant="outlined"
                component="label"
                style={{ marginTop: "20px" }}
              >

                Upload CSV

                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={uploadCSV}
                />

              </Button>

              {csvResult && (

                <Box mt={3}>

                  <Typography>
                    Total Reviews: {csvResult.total_reviews}
                  </Typography>

                  <Typography>
                    Fake Reviews: {csvResult.fake_reviews}
                  </Typography>

                  <Typography>
                    Genuine Reviews: {csvResult.genuine_reviews}
                  </Typography>

                  <Typography>
                    Fake Percentage: {csvResult.fake_percentage}%
                  </Typography>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={downloadResults}
                    style={{ marginTop: "10px" }}
                  >
                    Download Report
                  </Button>

                </Box>

              )}

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* Detection History */}

      <Card elevation={4} style={{ marginTop: "40px" }}>

        <CardContent>

          <Typography variant="h5" gutterBottom>
            Detection History
          </Typography>

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>ID</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell>Prediction</TableCell>
                  <TableCell>Fake Probability</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {reviewLogs.map((log) => (

                  <TableRow key={log.id}>

                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.review_text}</TableCell>
                    <TableCell>{log.prediction}</TableCell>
                    <TableCell>{log.fake_probability}</TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        </CardContent>

      </Card>

    </Container>

  );

}

export default App;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Box,  
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper
// } from "@mui/material";

// function App() {

//   const [review, setReview] = useState("");
//   const [result, setResult] = useState(null);
//   const [csvResult, setCsvResult] = useState(null);
//   const [reviewLogs, setReviewLogs] = useState([]);

//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   const fetchLogs = async () => {

//     const response = await axios.get(
//       "http://127.0.0.1:8000/review-logs"
//     );

//     setReviewLogs(response.data);

//   };

//   const detectReview = async () => {

//     const response = await axios.post(
//       "http://127.0.0.1:8000/detect-review",
//       null,
//       {
//         params: { review: review }
//       }
//     );

//     setResult(response.data);
//   };

// const uploadCSV = async (event) => {

//   const file = event.target.files[0];

//   const formData = new FormData();
//   formData.append("file", file);

//   try {

//     const response = await axios.post(
//       "http://127.0.0.1:8000/analyze-csv",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       }
//     );

//     setCsvResult(response.data);

//   } catch (error) {
//     console.error("CSV upload error:", error);
//   }
// };

// const downloadResults = () => {

//   const csvRows = [
//     ["Review", "Prediction", "Fake Probability", "Genuine Probability"]
//   ];

//   csvResult.results.forEach(r => {
//     csvRows.push([
//       r.review,
//       r.prediction,
//       r.fake_probability,
//       r.genuine_probability
//     ]);
//   });



//   const csvContent = csvRows.map(row => row.join(",")).join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv" });

//   const url = window.URL.createObjectURL(blob);

//   const a = document.createElement("a");

//   a.href = url;
//   a.download = "analysis_results.csv";

//   a.click();
// };

//   const chartData = result
//     ? [
//         { name: "Fake", value: result.fake_probability },
//         { name: "Genuine", value: result.genuine_probability }
//       ]
//     : [];

//   return (
//   <Container maxWidth="lg" style={{ marginTop: "40px" }}>

//     <Typography variant="h3" gutterBottom>
//       AI Fake Review Detection System
//     </Typography>

//     <Grid container spacing={4}>

//       {/* Single Review Analyzer */}
//       <Grid item xs={12} md={6}>
//         <Card elevation={4}>
//           <CardContent>

//             <Typography variant="h5">
//               Single Review Analyzer
//             </Typography>

//             <TextField
//               fullWidth
//               multiline
//               rows={5}
//               margin="normal"
//               label="Paste review text"
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//             />

//             <Button
//               variant="contained"
//               color="primary"
//               onClick={detectReview}
//             >
//               Analyze Review
//             </Button>

//             {result && (
//               <Box mt={3}>
//                 <Typography>
//                   Prediction: <b>{result.prediction}</b>
//                 </Typography>

//                 <Typography>
//                   Fake Probability: {result.fake_probability}
//                 </Typography>

//                 <Typography>
//                   Genuine Probability: {result.genuine_probability}
//                 </Typography>

//                 <PieChart width={300} height={250}>
//                   <Pie
//                     data={[
//                       { name: "Fake", value: result.fake_probability },
//                       { name: "Genuine", value: result.genuine_probability }
//                     ]}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     dataKey="value"
//                   >
//                     <Cell fill="#ff4d4d" />
//                     <Cell fill="#4caf50" />
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>

//               </Box>
//             )}

//           </CardContent>
//         </Card>
//       </Grid>

//       {/* CSV Analyzer */}
//       <Grid item xs={12} md={6}>
//         <Card elevation={4}>
//           <CardContent>

//             <Typography variant="h5">
//               Bulk CSV Review Analyzer
//             </Typography>

//             <Button
//               variant="outlined"
//               component="label"
//               style={{ marginTop: "20px" }}
//             >
//               Upload CSV
//               <input
//                 type="file"
//                 hidden
//                 accept=".csv"
//                 onChange={uploadCSV}
//               />
//             </Button>

//             {csvResult && (
//               <Box mt={3}>

//                 <Typography>
//                   Total Reviews: {csvResult.total_reviews}
//                 </Typography>

//                 <Typography>
//                   Fake Reviews: {csvResult.fake_reviews}
//                 </Typography>

//                 <Typography>
//                   Genuine Reviews: {csvResult.genuine_reviews}
//                 </Typography>

//                 <Typography>
//                   Fake Percentage: {csvResult.fake_percentage}%
//                 </Typography>

//                     <Button
//                       variant="contained"
//                       color="secondary"
//                       onClick={downloadResults}
//                       style={{ marginTop: "10px" }}
//                     >
//                       Download Report
//                     </Button>

//               </Box>
//             )}

//           </CardContent>
//         </Card>
//       </Grid>

//     </Grid>
    

//   </Container>

  
// );
// }

// export default App;