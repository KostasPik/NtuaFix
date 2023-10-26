import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: '#083358',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Ζημιά 1', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 2', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 3', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 4', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 5', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 6', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 7', 'Επιδιορθώθηκε', '20/10/2023'),
  createData('Ζημιά 8', 'Επιδιορθώθηκε', '20/10/2023'),
];

export default function MyTable({data}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Αναγνωριστικό Ζημιάς</StyledTableCell>
            <StyledTableCell>Τύπος Ζημιάς</StyledTableCell>
            <StyledTableCell align="left">Κατάσταση</StyledTableCell>
            <StyledTableCell align="left">Ημερομηνία Αναφοράς</StyledTableCell>
            <StyledTableCell align="left">Αναφορά Από</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((damage) => (
            <StyledTableRow key={damage.report_id}>
              <StyledTableCell component="th" scope="row">
                <Link to={`damage-report/${damage.report_id}/`}>Ζημιά {damage.report_id}</Link>
              </StyledTableCell>
              <StyledTableCell>{damage.damage_type}</StyledTableCell>
              <StyledTableCell align="left">{damage.damage_status}</StyledTableCell>
              <StyledTableCell align="left">{new Date(damage.created_at).toLocaleDateString('el-GR') + " " + new Date(damage.created_at).toLocaleTimeString('el-GR')}</StyledTableCell>
              <StyledTableCell align="left">el20112</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}