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
    { id: 'personnelTypeId', label: 'ID', minWidth: 50 },
    { id: 'personnelTypeName', label: 'Personnel Type Name', minWidth: 100 },
    { id: 'operation', label: 'Operation', minWidth: 30 }
];

const detailColumns = [
    { id: 'auth_id', label: 'Auth ID', minWidth: 20 },
    { id: 'auth_name', label: 'Auth Name', minWidth: 50 },
    { id: 'auth_note', label: 'Auth Note', minWidth: 100 },
    { id: 'operation', label: 'Operation', minWidth: 30 }
]

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

const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PersonnelType = () => {

    const [addOpen, setAddOpen] = React.useState(false);
    const handleAddModal = () => setAddOpen(!addOpen);

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditModal = () => setEditOpen(!editOpen);

    const [detailOpen, setDetailOpen] = React.useState(false);
    const handleDetailModal = () => setDetailOpen(!detailOpen);

    const [detailAddOpen, setDetailAddOpen] = React.useState(false);
    const handleDetailAddModal = () => setDetailAddOpen(!detailAddOpen);

    const [successInsert, setSuccessInsert] = React.useState(false);
    const [successDelete, setSuccessDelete] = React.useState(false);
    const [successEdit, setSuccessEdit] = React.useState(false);

    const [rows, setRow] = React.useState([]);
    const [detailRows, setDetailRows] = React.useState([]);
    const [detailPersonnelTypeId, setDetailPersonnelTypeId] = React.useState(0);
    const [authNormalRows, setAuthNormalRows] = React.useState([]);
    const [authNormalSelect, setAuthNormalSelect] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(0);

    const [addPersonnelTypeName, setAddPersonnelTypeName] = React.useState("");

    const [editPersonnelTypeId, setEditPersonnelTypeId] = React.useState(0);
    const [editPersonnelTypeName, setEditPersonnelTypeName] = React.useState("");

    const [searchContent, setSearchContent] = React.useState('');
    const [searchStatus, setSearchStatus] = React.useState(false);

    useEffect(() => {
        const getPersonnelType = async () => {
            const res =
                await axios.get(`http://localhost:8082/personnelType/queryAllPersonnelType`, {
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
        if (!addPersonnelTypeName) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/personnelType/addNewPersonnelType`, qs.stringify({
            personnelTypeName: addPersonnelTypeName,
        })).then(function (response) {
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                setAddOpen(false);
            }
        });
        setAddPersonnelTypeName('')
    }

    const deleteFunction = (Id) => {
        axios.delete(`http://localhost:8082/personnelType/removePersonnelTypeById`, {
            params: {
                personnelTypeId: Id,
            }
        }).then(function (response) {
            if (response.data) {
                setSuccessDelete(true);
                setTimeout(() => { setSuccessDelete(false) }, 3000);
            }
        })
    }

    const getEditFunction = (Id) => {
        axios.get(`http://localhost:8082/personnelType/getPersonnelTypeById`, {
            params: {
                personnelTypeId: Id,
            }
        }
        ).then(function (response) {
            setEditPersonnelTypeId(response.data.t.personnelTypeId);
            setEditPersonnelTypeName(response.data.t.personnelTypeName)
        });

    }

    const editFunction = (e) => {
        e.preventDefault();
        if (!editPersonnelTypeId || !editPersonnelTypeName) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/personnelType/editPersonnelTypeById`, qs.stringify({
            personnelTypeId: editPersonnelTypeId,
            personnelTypeName: editPersonnelTypeName,
        })).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                setEditOpen(false);
            }
        });
        setEditPersonnelTypeId(0)
        setEditPersonnelTypeName('')
    }

    const searchFunction = () => {
        if(searchContent === '')
        {
            setSearchStatus(!searchStatus);
        }else
        {
            axios.get(`http://localhost:8082/personnelType/searchPersonnelType`, {
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

    const getDetailFunction = (Id) => {
        axios.get(`http://localhost:8082/personnelType/selectAuthByPersonnelTypeId`, {
                params: {
                        'personnelTypeId': Id
                    }
                }).then((res) => {
                    setDetailRows(res.data.t);
                    setDetailPersonnelTypeId(Id);
                });
    }

    const deletePersonnelAuth = (Id) => {
        axios.delete(`http://localhost:8082/personnelType/deletePersonnelAuth`, {
            params: {
                personnelTypeId: detailPersonnelTypeId,
                authId: Id,
            }
        }).then(function (response) {
            if (response.data) {
                setSuccessDelete(true);
                setTimeout(() => { setSuccessDelete(false) }, 3000);
                getDetailFunction(detailPersonnelTypeId);
            }
        })
    }

    const queryAuthNormal = () => {
        axios.get(`http://localhost:8082/authenNormal/queryAllAuthenNormalAll`).then(
        (response) => {
          let arr = response.data.t;
          setAuthNormalRows(arr.map(x => {return {label:x.authName, id:x.authId}}));
        }
      )
    }

    const addPersonnelAuth = () => {
        if (!authNormalSelect) {
            alert('Please select field!')
            return
        }
        axios.post(`http://localhost:8082/personnelType/insertPersonnelAuth`, qs.stringify({
            authId: authNormalSelect['id'],
            personnelTypeId : detailPersonnelTypeId,
        })).then(function (response) {
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                getDetailFunction(detailPersonnelTypeId);
            }
        });
        setAuthNormalSelect([]);
        handleDetailAddModal();
    }


    return (
        <>
            <h1>Edit Personnel Type
                <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={handleAddModal}>
                    <AddIcon />Add Personnel Type
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
                            <TextField required fullWidth label="Personnel Type Name" value={addPersonnelTypeName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setAddPersonnelTypeName(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addFunction}>
                                Add New PersonnelType
                            </Button>
                        </form>
                    </Box>
                </Fade>

            </Modal>
            <Modal
                open={detailAddOpen}
                onClose={handleDetailAddModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={detailAddOpen}>
                    <Box sx={style}>
                        <form onSubmit={addPersonnelAuth}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Add
                            </Typography>
                            <Autocomplete style={{ marginTop: '1rem' }}
                                value = {authNormalSelect}
                                onChange={(event, newValue) => {setAuthNormalSelect(newValue);}}
                                disablePortal
                                options={authNormalRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Options" />}
                            />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addPersonnelAuth}>
                                Add New Clearance
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
                    <Box sx={style2}>
                    <Typography variant="h5" component="div" gutterBottom>
                        Personnel Clearance
                        <Button size = 'small' variant="outlined" color="success" style={{ marginLeft: '10px' }} onClick = {() => {handleDetailAddModal();queryAuthNormal()}}>
                            <AddIcon />Add Personnel Clearance
                        </Button>
                    </Typography>
                        
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {detailColumns.map((column) => (
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
                                {detailRows
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.auth_id}>
                                                {detailColumns.filter(x => x.id !== 'operation').map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell key='3' align={detailColumns[3].align}>
                                                    <Button variant="outlined" color="error" onClick={() => { deletePersonnelAuth(row.auth_id) }}>
                                                        <DeleteIcon />Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                    </Table>
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
                            <TextField fullWidth label="Personnel Type ID" value={editPersonnelTypeId}
                                style={{ marginTop: '1rem' }} onChange={(e) => setEditPersonnelTypeId(e.target.value)} />
                            <TextField fullWidth label="Personnel Type Name"  value={editPersonnelTypeName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditPersonnelTypeName(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                                Edit Personnel Type
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.personnelTypeId}>
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
                                            <TableCell key='3' align={columns[2].align}>
                                                <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.personnelTypeId) }}>
                                                    <DeleteIcon />Delete
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.personnelTypeId) }} color="secondary" style={{ marginLeft: '2rem' }} >
                                                    <ChangeCircleIcon />Edit
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setDetailOpen(true); getDetailFunction(row.personnelTypeId) }} style={{ marginLeft: '2rem' }} >
                                                    <InfoIcon />Detail
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

export default PersonnelType
