import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
import qs from 'qs';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { Autocomplete } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

const columns = [
    { id: 'personnelId', label: 'ID', minWidth: 20 },
    { id: 'personnelStatus', label: 'Status', minWidth: 10 },
    { id: 'personnelTypeId', label: 'Type Id', minWidth: 10 },
    { id: 'personnelFirstName', label: 'Firstname', minWidth: 40 },
    { id: 'personnelMidName', label: 'Midname', minWidth: 40 },
    { id: 'personnelLastName', label: 'Lastname', minWidth: 40 },
    { id: 'personnelEnrollTime', label: 'Enroll Time', minWidth: 40 },
    { id: 'personnelResignTime', label: 'Resign Time', minWidth: 40 },
    { id: 'personnelEmail', label: 'Email', minWidth: 40 },
    { id: 'operation', label: 'Operation', minWidth: 30 }
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Personnel = () => {

    const [addOpen, setAddOpen] = React.useState(false);
    const handleAddModal = () => setAddOpen(!addOpen);

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditModal = () => setEditOpen(!editOpen);

    const [detailOpen, setDetailOpen] = React.useState(false);
    const handleDetailModal = () => setDetailOpen(!detailOpen);

    const [successInsert, setSuccessInsert] = React.useState(false);
    const [successDelete, setSuccessDelete] = React.useState(false);
    const [successEdit, setSuccessEdit] = React.useState(false);

    const [rows, setRow] = React.useState([]);
 
    const [personnelTypeRows, setPersonnelTypeRows] = React.useState([]);
    const [personnelTypeSelect, setPersonnelTypeSelect] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(0);

    const [addPersonnelFirstName, setAddPersonnelFirstName] = React.useState("");
    const [addPersonnelMidName, setAddPersonnelMidName] = React.useState("");
    const [addPersonnelLastName, setAddPersonnelLastName] = React.useState("");
    const [addPersonnelEmail, setAddPersonnelEmail] = React.useState("");

    const [editPersonnelId, setEditPersonnelId] = React.useState(0);
    const [editPersonnelStatus, setEditPersonnelStatus] = React.useState(1);
    const [editPersonnelFirstName, setEditPersonnelFirstName] = React.useState("");
    const [editPersonnelMidName, setEditPersonnelMidName] = React.useState("");
    const [editPersonnelLastName, setEditPersonnelLastName] = React.useState("");
    const [editPersonnelEmail, setEditPersonnelEmail] = React.useState("");

    const [searchContent, setSearchContent] = React.useState('');
    const [searchStatus, setSearchStatus] = React.useState(false);

    const [editPass, setEditPass] = React.useState('')
    const [editPassId, setEditPassId] = React.useState(0);

    useEffect(() => {
        const getPersonnelType = async () => {
            const res =
                await axios.get(`http://localhost:8082/personnel/queryAllPersonnel`, {
                    params: {
                        page: page,
                        rowsPerPage: rowsPerPage
                    }
                });
            setRow(res.data.t);
            setTotalPage(res.data.info);
        };

        getPersonnelType()
    }, [page, rowsPerPage, successInsert, successDelete, successEdit, searchStatus])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addFunction = (e) => {
        e.preventDefault();
        if (!addPersonnelFirstName || !personnelTypeSelect) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/personnel/addNewPersonnel`, qs.stringify({
            personnelFirstName: addPersonnelFirstName,
            personnelMidName: addPersonnelMidName,
            personnelLastName: addPersonnelLastName,
            personnelEmail: addPersonnelEmail,
            personnelTypeId: personnelTypeSelect['id'],
        })).then(function (response) {
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                setAddOpen(false);
            }
        });
        setAddPersonnelFirstName('')
        setAddPersonnelMidName('')
        setAddPersonnelLastName('')
        setAddPersonnelEmail('')
        setPersonnelTypeSelect([])
    }

    const deleteFunction = (Id) => {
        axios.delete(`http://localhost:8082/personnel/removePersonnelById`, {
            params: {
                personnelId: Id,
            }
        }).then(function (response) {
            if (response.data) {
                setSuccessDelete(true);
                setTimeout(() => { setSuccessDelete(false) }, 3000);
            }
        })
    }

    const getEditFunction = (Id) => {
        axios.get(`http://localhost:8082/personnel/getPersonnelById`, {
            params: {
                personnelId: Id,
            }
        }
        ).then(function (response) {
            setEditPersonnelId(response.data.t.personnelId);
            setEditPersonnelStatus(response.data.t.personnelStatus);
            setPersonnelTypeSelect({'label': response.data.info, 'id':response.data.t.personnelTypeId});
            setEditPersonnelFirstName(response.data.t.personnelFirstName);
            setEditPersonnelMidName(response.data.t.personnelMidName);
            setEditPersonnelLastName(response.data.t.personnelLastName);
            setEditPersonnelEmail(response.data.t.personnelEmail);
        });
    }

    const editFunction = (e) => {
        e.preventDefault();
        if (!editPersonnelId || !editPersonnelFirstName) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/personnel/editPersonnelById`, qs.stringify({
            personnelFirstName: editPersonnelFirstName,
            personnelMidName: editPersonnelMidName,
            personnelLastName: editPersonnelLastName,
            personnelEmail: editPersonnelEmail,
            personnelTypeId: personnelTypeSelect['id'],
            personnelId: editPersonnelId,
            personnelStatus: editPersonnelStatus,
        })).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                setEditOpen(false);
            }
        });
            setEditPersonnelId(0);
            setEditPersonnelStatus(1)
            setPersonnelTypeSelect([])
            setEditPersonnelFirstName('')
            setEditPersonnelMidName('')
            setEditPersonnelLastName('')
            setEditPersonnelEmail('')
    }

    const searchFunction = () => {
        if(searchContent === '')
        {
            setSearchStatus(!searchStatus);
        }else
        {
            axios.get(`http://localhost:8082/personnel/searchPersonnel`, {
                params: {
                        page: page,
                        rowsPerPage: rowsPerPage,
                        'searchContent': searchContent
                    }
                }).then((res) => {
                    setRow(res.data.t);
                    setTotalPage(res.data.info);
                });
        }
    }

    const queryPersonnelType = () => {
        axios.get(`http://localhost:8082/personnelType/queryAllPersonnelTypeAll`).then(
        (response) => {
          let arr = response.data.t;
          setPersonnelTypeRows(arr.map(x => {return {label:x.personnelTypeName, id:x.personnelTypeId}}));
        }
      )
    }

    const queryPass = (Id) => {
        axios.get(`http://localhost:8082/personnel/getPasswordByPersonnelId`, {
            params:{
                personnelId: Id,
            }
        }).then(
            (response) => {
                setEditPass(response.data.t);
                setEditPassId(Id);
            }
      )
    }

    const updatePass = () => {
        setDetailOpen(false);
        axios.post(`http://localhost:8082/personnel/updatePasswordByPersonnelId`, qs.stringify({
            personnelId: editPassId,
            personnelPassword: editPass,
        })).then(function (response) {
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                setDetailOpen(false);
                setEditPass('')
                setEditPassId(0)
            }
        });
        setEditPass('')
        setEditPassId(0)
    }

    

    return (
        <>
            <h1>Edit Personnel
                <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => {handleAddModal();queryPersonnelType();setPersonnelTypeSelect([])}}>
                    <AddIcon />Add Personnel
                </Button>
                <TextField id="outlined-basic" style={{ marginLeft: '2rem' }} label="Search" variant="outlined" value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)}/>
                <Button variant="outlined" startIcon={<SearchIcon/>} style={{ marginLeft: '2rem' }} onClick={searchFunction}>
                    Search
                </Button>
                
            </h1>
            {successInsert ? (<Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Insert Successful — <strong>Affected Rows: 1!</strong>
            </Alert>) : ''}
            {successEdit ? (<Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Edit Successful — <strong>Affected Rows: 1!</strong>
            </Alert>) : ''}
            {successDelete ? (<Alert severity="info">Delete Successful — Affected Rows: 1!</Alert>
            ) : ''}
            <Modal
                open={addOpen}
                onClose={handleAddModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={addOpen}>
                    <Box sx={style}>
                        <form onSubmit={addFunction}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Add
                            </Typography>
                            <TextField required fullWidth label="Personnel Firstname" value={addPersonnelFirstName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setAddPersonnelFirstName(e.target.value)} />
                            <TextField fullWidth label="Personnel Midname" value={addPersonnelMidName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setAddPersonnelMidName(e.target.value)} />
                            <TextField fullWidth label="Personnel Lastname" value={addPersonnelLastName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setAddPersonnelLastName(e.target.value)} />
                            <TextField fullWidth label="Personnel Email" value={addPersonnelEmail}
                                style={{ marginTop: '2rem' }} onChange={(e) => setAddPersonnelEmail(e.target.value)} />
                            <Autocomplete style={{ marginTop: '2rem' }}
                                value = {personnelTypeSelect}
                                onChange={(event, newValue) => {setPersonnelTypeSelect(newValue);}}
                                disablePortal
                                id="select"
                                options={personnelTypeRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Personnel Type" />}
                            />
                            <Button variant="contained" color="success" style={{ marginTop: '4rem', marginLeft: '15%' }} onClick={addFunction}>
                                Add New Personnel
                            </Button>
                        </form>
                    </Box>
                </Fade>

            </Modal>
            <Modal
                open={editOpen}
                onClose={handleEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={editOpen}>
                    <Box sx={style}>
                        <form onSubmit={editFunction}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Edit
                            </Typography>
                            <TextField required fullWidth label="Personnel Id" value={editPersonnelId}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelId(e.target.value)} />
                            <TextField required fullWidth label="Personnel Status (0 for resign, 1 for current)" value={editPersonnelStatus}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelStatus(e.target.value)} />
                            <Autocomplete style={{ marginTop: '2rem' }}
                                value = {personnelTypeSelect}
                                onChange={(event, newValue) => {setPersonnelTypeSelect(newValue);}}
                                disablePortal
                                id="select"
                                options={personnelTypeRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Personnel Type" />}
                            />
                            <TextField required fullWidth label="Personnel Firstname" value={editPersonnelFirstName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelFirstName(e.target.value)} />
                            <TextField fullWidth label="Personnel Midname" value={addPersonnelMidName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelMidName(e.target.value)} />
                            <TextField fullWidth label="Personnel Lastname" value={editPersonnelLastName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelLastName(e.target.value)} />
                            <TextField fullWidth label="Personnel Email" value={editPersonnelEmail}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelEmail(e.target.value)} />
                            
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                                Edit Personnel
                            </Button>
                        </form>
                    </Box>
                </Fade>

            </Modal>
            <Modal
                open={detailOpen}
                onClose={handleDetailModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={detailOpen}>
                    <Box sx={style}>
                        <form onSubmit={updatePass}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Password
                            </Typography>
                            <TextField required fullWidth label="Password" value={editPass}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPass(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '4rem', marginLeft: '15%' }} onClick={updatePass}>
                                Update Password
                            </Button>
                        </form>
                    </Box>
                </Fade>

            </Modal>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 1000 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.personnelId}>
                                            {columns.filter(x => x.id !== 'operation').map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell key='9' align={columns[9].align}>
                                                <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.personnelId) }}>
                                                    <DeleteIcon />Delete
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.personnelId);queryPersonnelType() }} color="secondary" style={{ marginLeft: '2rem' }} >
                                                    <ChangeCircleIcon />Edit
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setDetailOpen(true); queryPass(row.personnelId);}} style={{ marginLeft: '2rem' }} >
                                                    <InfoIcon />Password
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={totalPage * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>

    );
}

export default Personnel
