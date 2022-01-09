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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material';
import { Autocomplete } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';

const columnClearnce = [
    { id: 'auth_item_id', label: 'Authen Item ID', minWidth: 50 },
    { id: 'auth_item_name', label: 'Authen Item Name', minWidth: 100 },
    { id: 'auth_item_description', label: 'Description', minWidth: 80 },
    { id: 'operation', label: 'Operations', minWidth: 50 },
];

const columns = [
    { id: 'authId', label: 'Authen ID', minWidth: 50 },
    { id: 'authName', label: 'Authen Name', minWidth: 40 },
    { id: 'authNote', label: 'Note', minWidth: 80 },
    { id: 'operation', label: 'Operation', minWidth: 50 },
    { id: 'expansion', label: '', minWidth: 10 },
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

const AuthenNormalClearance = () => {
    
    const [addOpen, setAddOpen] = React.useState(false);
    const handleAddModal = () => setAddOpen(!addOpen);

    const [addClearanceOpen, setAddClearanceOpen] = React.useState(false);
    const handleAddClearanceModal = () => setAddClearanceOpen(!addClearanceOpen);

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditModal = () => setEditOpen(!editOpen);

    const [detailOpen, setDetailOpen] = React.useState(new Map());
    const updateDetailOpen = (key, value) => {
        setDetailOpen(map => new Map(map.set(key, value)));
    }
    const isOpenDetail = (authId) => {
        if (detailOpen.get(authId) === null)
            updateDetailOpen(authId, false);
        if (detailOpen.get(authId) === false)
            return false;
        if (detailOpen.get(authId) === true)
            return true;
    }

    const openDetail = (authId) => {
        updateDetailOpen(authId, !detailOpen.get(authId));
    }

    const [clearanceRows, setClearanceRows] = React.useState([[]]);
    const changeClearanceRow = (row, rowArr) => {
        let copy = [...clearanceRows];
        copy[row] = rowArr;
        setClearanceRows(copy);
    }
    const [clearanceRowIndex, setIndex] = React.useState(0);

    const [successInsert, setSuccessInsert] = React.useState(false);
    const [successDelete, setSuccessDelete] = React.useState(false);
    const [successEdit, setSuccessEdit] = React.useState(false);

    const [rows, setRow] = React.useState([]);
    const [avclearanceRows, setAvClearanceRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(0);

    const [addAuthName, setAddAuthName] = React.useState("");
    const [addAuthNote, setAddAuthNote] = React.useState("");

    const [clearanceSelect, setClearanceSelect] = React.useState([]);

    const [editAuthID, setEditAuthID] = React.useState(0);
    const [editAuthName, setEditAuthName] = React.useState("");
    const [editAuthNote, setEditAuthNote] = React.useState("");

    const [searchContent, setSearchContent] = React.useState('');
    const [searchStatus, setSearchStatus] = React.useState(false);

    useEffect(() => {
        const getAuthenNormal = () => {
            setDetailOpen(new Map());
        };
        getAuthenNormal()
    }, [page, rowsPerPage, successInsert, successDelete, successEdit, searchStatus])

    useEffect(() => {
        const getAuthenNormal = async () => {
            const res =
                await axios.get(`http://localhost:8082/authenNormal/queryAllAuthenNormal`, {
                    params: {
                        page: page,
                        rowsPerPage: rowsPerPage
                    }
                });
            setRow(res.data.t);
            setTotalPage(res.data.info);
        };
        getAuthenNormal()
    }, [page, rowsPerPage, successInsert, successDelete, successEdit, searchStatus])

    const getClearance = async (Id) => {
        await axios.get(`http://localhost:8082/authenNormal/selectAffiliation`, {
            params: {
                authId: Id,
            }
        }).then(function (response) {
            changeClearanceRow(Id, response.data);
            setIndex(Id);
        });
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addNewFunction = (e) => {
        e.preventDefault();
        if (!addAuthName) {
            alert('Please add required fields!')
            return
        }
        axios.post(`http://localhost:8082/authenNormal/addNewAuthenNormal`, qs.stringify({
            authName: addAuthName,
            authNote: addAuthNote
        })).then(function (response) {
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                setAddOpen(false);
            }
        });
        setAddAuthName('')
        setAddAuthNote('')
    }

    const deleteFunction = (Id) => {
        axios.delete(`http://localhost:8082/authenNormal/removeAuthenNormalById`, {
            params: {
                authId: Id,
            }
        }).then(function (response) {
            if (response.data) {
                setSuccessDelete(true);
                setTimeout(() => { setSuccessDelete(false) }, 3000);
            }
        })
    }

    const getEditFunction = (Id) => {
        axios.get(`http://localhost:8082/authenNormal/getAuthenNormalById`, {
            params: {
                authId: Id,
            }
        }
        ).then(function (response) {
            setEditAuthID(response.data.t.authId);
            setEditAuthName(response.data.t.authName);
            setEditAuthNote(response.data.t.authNote);
        });

    }

    const editFunction = (e) => {
        e.preventDefault();
        if (!editAuthID || !editAuthName) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/authenNormal/editAuthenNormalById`, qs.stringify({
            authId: editAuthID,
            authName: editAuthName,
            authNote: editAuthNote,
        })).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                setEditOpen(false);
            }
        });
        setEditAuthID(0);
        setEditAuthName('');
        setEditAuthNote('');
    }

    const searchFunction = () => {
        if (searchContent === '') {
            setSearchStatus(!searchStatus);
        } else {
            axios.get(`http://localhost:8082/authenNormal/searchAuthenNormal`, {
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

    const deleteClearanceFunction = (authenId, authenItemId) => {
        axios.delete(`http://localhost:8082/authenNormal/removeClearance`, {
            params: {
                authenId: authenId,
                authenItemId: authenItemId,
            }
        }).then(function (response) {
            if (response.data) {
                setSuccessDelete(true);
                setTimeout(() => { setSuccessDelete(false) }, 3000);
            }
        })
    }

    const queryClearance = (e) => {
        axios.get(`http://localhost:8082/authenItem/queryAllAuthenItemAll`).then((res) => {
            let arr = res.data.t;
            setAvClearanceRows(arr.map(x => {return {label:x.authItemName, id:x.authItemId}}));
        });
    }

    const addClearanceFunction = (e) => {
        e.preventDefault();
        if (!clearanceSelect) {
            alert('Please add required fields!')
            return
        }
        axios.post(`http://localhost:8082/authenNormal/addNewClearance`, qs.stringify({
            authenId: clearanceRowIndex,
            authenItemId: clearanceSelect['id']
        })).then(function (response) {
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                setAddClearanceOpen(false);
            }
        });
        setClearanceSelect([])

    }


    return (
        <>
            <h1>Edit Authentication Job Name and Clearance
                <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={handleAddModal}>
                    <AddIcon />Add Authentication Job Name
                </Button>
                <TextField id="outlined-basic" style={{ marginLeft: '2rem' }} label="Search" variant="outlined" value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)} />
                <Button variant="outlined" startIcon={<SearchIcon />} style={{ marginLeft: '2rem' }} onClick={searchFunction}>
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
                        <form onSubmit={addNewFunction}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Add
                            </Typography>
                            <TextField required fullWidth label="Auth Name" id="authNameInput" value={addAuthName}
                                style={{ marginTop: '1rem' }} onChange={(e) => setAddAuthName(e.target.value)} />
                            <TextField fullWidth label="Auth Description" id="authDescrInput" value={addAuthNote}
                                style={{ marginTop: '2rem' }} onChange={(e) => setAddAuthNote(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addNewFunction}>
                                Add New Auth Job
                            </Button>
                        </form>
                    </Box>
                </Fade>

            </Modal>
            
            <Modal
                open={addClearanceOpen}
                onClose={handleAddClearanceModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={addClearanceOpen}>
                    <Box sx={style}>
                        <form onSubmit={addClearanceFunction}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Add Clearance
                            </Typography>
                            <TextField disabled fullWidth label="Auth ID" id="authNameInputD" value={clearanceRowIndex}
                                style={{ marginTop: '1rem' }}/>
                            <Autocomplete style={{ marginTop: '1rem' }}
                                value = {clearanceSelect}
                                onChange={(event, newValue) => {setClearanceSelect(newValue);}}
                                disablePortal
                                id="selectClearance"
                                options={avclearanceRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="options" />}
                            />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addClearanceFunction}>
                                Add New Clearance
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
                            <TextField required fullWidth label="Auth ID" id="authIdEditInput" value={editAuthID}
                                style={{ marginTop: '1rem' }} onChange={(e) => setEditAuthID(e.target.value)} />
                            <TextField required fullWidth label="Auth Name" id="authNameEditInput" value={editAuthName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditAuthName(e.target.value)} />
                            <TextField fullWidth label="Auth Note" id="authNoteEditInput" value={editAuthNote}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditAuthNote(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                                Edit Auth
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
                                        <>
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.authId}>
                                                {columns.filter(x => x.id !== 'operation').filter(x => x.id !== 'expansion').map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell key='3' align={columns[3].align}>
                                                    <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.authId) }}>
                                                        <DeleteIcon />Delete
                                                    </Button>
                                                    <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.authId) }} color="secondary" style={{ marginLeft: '2rem' }} >
                                                        <ChangeCircleIcon />Edit
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => { openDetail(row.authId); getClearance(row.authId) }}
                                                    >
                                                        {isOpenDetail(row.authId) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={isOpenDetail(row.authId)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Detail
                                                                <Button size='small' variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => {handleAddClearanceModal(); queryClearance()}}>
                                                                    <AddIcon />Add Clearance
                                                                </Button>
                                                            </Typography>

                                                            <Table size="small" aria-label="auth clearance">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        {columnClearnce.map((column2) => (
                                                                            <TableCell
                                                                                key={column2.id}
                                                                                align={column2.align}
                                                                                style={{ minWidth: column2.minWidth }}
                                                                            >
                                                                                {column2.label}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {clearanceRows[clearanceRowIndex]
                                                                        .map((Currrow) => {
                                                                            return (
                                                                                <>
                                                                                    <TableRow hover role="checkbox" tabIndex={-1} key={Currrow.auth_item_id}>
                                                                                        {columnClearnce.filter(x => x.id !== 'operation').map((columnClearnce) => {
                                                                                            const value2 = Currrow[columnClearnce.id];
                                                                                            return (
                                                                                                <TableCell key={columnClearnce.id} align={columnClearnce.align}>
                                                                                                    {columnClearnce.format && typeof value2 === 'number'
                                                                                                        ? columnClearnce.format(value2)
                                                                                                        : value2}
                                                                                                </TableCell>
                                                                                            );
                                                                                        })}
                                                                                        <TableCell key='3' align={columnClearnce[3].align}>
                                                                                            <Button size="small" variant="outlined" color="error" onClick={() => { deleteClearanceFunction(clearanceRowIndex, Currrow.auth_item_id) }}>
                                                                                                <DeleteIcon />Delete
                                                                                            </Button>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </>
                                                                            );
                                                                        })
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
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

export default AuthenNormalClearance
