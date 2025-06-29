// AttendanceReport.js
import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  tableHeader: { margin: "auto", marginTop: 5, fontSize: 12, fontWeight: 'bold' },
});

const AttendanceReportPDF = ({ reportData, startDate, endDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Attendance Report</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>
        Period: {startDate} to {endDate}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Name</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Days Present</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Total Days</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Attendance Rate</Text></View>
        </View>
        {reportData.map((item) => (
          <View style={styles.tableRow} key={item.user.id}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{`${item.user.FirstName} ${item.user.LastName}`}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.attendance_count}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.total_days}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{`${item.attendance_rate}%`}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const AttendanceReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/attendance/report/', {
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
      });
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to fetch report data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Attendance Report</h1>
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchReportData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Report
          </button>
        </div>
      </div>

      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {reportData && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Report Summary</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((item) => (
                <tr key={item.user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{`${item.user.FirstName} ${item.user.LastName}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.attendance_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.total_days}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{`${item.attendance_rate}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <PDFDownloadLink
              document={<AttendanceReportPDF reportData={reportData} startDate={startDate.toISOString().split('T')[0]} endDate={endDate.toISOString().split('T')[0]} />}
              fileName="attendance_report.pdf"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : 'Download PDF Report'
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;