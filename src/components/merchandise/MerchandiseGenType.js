import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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


export default function MerchandiseGenType() {
    const [rows, setRow] = React.useState([]);

    useEffect(() => {
        const getStates = async () => {
        const res =
            await axios.get(`http://localhost:8082/merchandiseGenType/queryAllType`);
        setRow(res.data.t);
        };
        getStates()
    }, [])

  return (
      <>
        <Typography variant="h4" component="div" gutterBottom>
            Merchandise General
        </Typography>
        <Divider variant="middle"/>
        <TableContainer component={Paper} style={{marginTop:'3rem'}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Category Name</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <StyledTableRow key={row.merchGenTypeId}>
                    <StyledTableCell component="th" scope="row">
                        {row.merchGenTypeId}
                    </StyledTableCell>
                    <StyledTableCell>{row.merchGenTypeName}</StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
      </>
    
  );
}
