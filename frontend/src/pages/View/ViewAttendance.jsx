import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { format } from 'date-fns';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import api from '../../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendanceData = async () => {
    try {
      const response = await api.get('api/attendance/list/'); // Add 'await' here
      setAttendanceData(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch attendance data');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAttendanceData();
  }, []); // Ensure this is only called once
  
  

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Total Attendance',
        accessor: 'totalAttendance',
      },
      {
        Header: 'Attendance Rate',
        accessor: 'attendanceRate',
        Cell: ({ value }) => `${value.toFixed(2)}%`,
      },
      {
        Header: 'Last Attendance',
        accessor: 'lastAttendance',
        Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy'),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: attendanceData.length > 0 ? attendanceData : [],
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const chartData = {
    labels: attendanceData.map(d => d.name),
    datasets: [
      {
        label: 'Attendance Rate',
        data: attendanceData.map(d => d.attendanceRate),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Attendance Overview</h2>
      
      {attendanceData.length > 0 ? (
        <>
          <div className="mb-8">
            <Line data={chartData} />
          </div>

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table {...getTableProps()} className="w-full table-auto">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-6 text-left">
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? <FaSortDown className="inline ml-1" />
                              : <FaSortUp className="inline ml-1" />
                            : <FaSort className="inline ml-1" />}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="text-gray-600 text-sm font-light">
                {page.map(row => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} className="border-b border-gray-200 hover:bg-gray-100">
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()} className="py-3 px-6 text-left whitespace-nowrap">
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination mt-4 flex justify-between items-center">
            <div>
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-l hover:bg-gray-400">
                {'<<'}
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-4 py-2 font-bold text-gray-500 bg-gray-300 hover:bg-gray-400">
                {'<'}
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="px-4 py-2 font-bold text-gray-500 bg-gray-300 hover:bg-gray-400">
                {'>'}
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-r hover:bg-gray-400">
                {'>>'}
              </button>
            </div>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
              className="px-2 py-1 border rounded"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <p>No attendance data available.</p>
      )}
    </div>
  );
};

export default ViewAttendance;
