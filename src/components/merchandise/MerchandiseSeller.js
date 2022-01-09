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
import { ImageList, ImageListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

const columns2 = [
    { id: 'merchSubId', label: 'Sub ID', minWidth: 20 },
    { id: 'merchSubStatus', label: 'Status', minWidth: 50 },
    { id: 'merchSubName', label: 'Name', minWidth: 20 },
    { id: 'merchSubPrice', label: 'Price', minWidth: 50 },
    { id: 'merchSubOnsalePrice', label: 'On-sale Price', minWidth: 50 },
    { id: 'merchSubRemaining', label: 'Remain', minWidth: 50 },
    { id: 'merchSubOnsaleEndDate', label: 'On-sale End Date', minWidth: 50 },
    { id: 'operation', label: 'Operation', minWidth: 30 }
];

const columns = [
    { id: 'merch_id', label: 'Merch ID', minWidth: 20 },
    { id: 'merch_type_id', label: 'Type ID', minWidth: 20 },
    { id: 'merch_name', label: 'Merch Name', minWidth: 50 },
    { id: 'merch_type_name', label: 'CategoryName', minWidth: 50 },
    { id: 'operation', label: 'Operation', minWidth: 30 }
];

const promotionRows = [
    { label: '1 Day After', id: 1 },
    { label: '2 Day After', id: 2 },
    { label: '3 Day After', id: 3 },
    { label: '5 Day After', id: 5 },
    { label: '10 Day After', id: 10 },
]

const Input = styled('input')({
    display: 'none',
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
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
    width: 1700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const style3 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const MerchandiseSeller = () => {

    const [addOpen, setAddOpen] = React.useState(false);
    const handleAddModal = () => { setAddOpen(!addOpen) };

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditModal = () => setEditOpen(!editOpen);

    const [imageOpen, setImageOpen] = React.useState(false);
    const handleImageModal = () => setImageOpen(!imageOpen);

    const [editDescrOpen, setEditDescrOpen] = React.useState(false);
    const handleEditDescrModal = () => setEditDescrOpen(!editDescrOpen);

    const [editDescrImgOpen, setEditDescrImgOpen] = React.useState(false);
    const handleEditDescrImgModal = () => setEditDescrImgOpen(!editDescrImgOpen);

    const [detailOpen, setDetailOpen] = React.useState(false);
    const handleDetailModal = () => setDetailOpen(!detailOpen);

    const [detailAddOpen, setDetailAddOpen] = React.useState(false);
    const handleDetailAddModal = () => setDetailAddOpen(!detailAddOpen);

    const [detailEditOpen, setDetailEditOpen] = React.useState(false);
    const handleDetailEditModal = () => setDetailEditOpen(!detailEditOpen);

    const [detailImgOpen, setDetailImgOpen] = React.useState(false);
    const handleDetailImgModal = () => setDetailImgOpen(!detailImgOpen);

    const [successInsert, setSuccessInsert] = React.useState(false);
    const [successEdit, setSuccessEdit] = React.useState(false);

    const [rows, setRow] = React.useState([]);
    const [categoryRows, setCategoryRows] = React.useState([]);
    const [categorySelect, setCategorySelect] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(0);

    const [addTypeName, setAddTypeName] = React.useState("");

    const [editID, setEditID] = React.useState(0);
    const [editName, setEditName] = React.useState("");
    const [editStatus, setEditStatus] = React.useState(0);

    const [searchContent, setSearchContent] = React.useState('');
    const [searchStatus, setSearchStatus] = React.useState(false);

    const [uploadFolder, setUploadFolder] = React.useState('');
    const [ImageFolder, setImageFolder] = React.useState('');
    const [imageSet, setImageSet] = React.useState([]);
    const [uploadImageMerchId, setUploadImageMerchId] = React.useState(0);
    const [uploadInfo, setUploadInfo] = React.useState('')

    const [editDescription, setEditDescription] = React.useState('');
    const [descrImgNum, setDescrImgNum] = React.useState([]);

    const [descrImgMerchId, setDescrImgMerchId] = React.useState(0);

    const [detailRows, setDetailRows] = React.useState([]);
    const [detailMerchId, setDetailMerchId] = React.useState(0);

    const [addMerchSubName, setAddMerchSubName] = React.useState('');
    const [addMerchSubPrice, setAddMerchSubPrice] = React.useState(0.00);
    const [addMerchSubRemaining, setAddMerchSubRemaining] = React.useState(0);

    const [editMerchSubId, setEditMerchSubId] = React.useState(0);
    const [editMerchSubName, setEditMerchSubName] = React.useState('');
    const [editMerchSubPrice, setEditMerchSubPrice] = React.useState(0.00);
    const [editMerchSubOnsalePrice, setEditMerchSubOnsalePrice] = React.useState(0.00);
    const [editMerchSubRemaining, setEditMerchSubRemaining] = React.useState(0);
    const [editMerchSubOnsaleEndDate, setEditMerchSubOnsaleEndDate] = React.useState(0);

    const [promoteDateSelect, setPromoteDateSelect] = React.useState([]);

    const [subImgUrl, setSubImgUrl] = React.useState('');
    const [subImgMerchSubId, setSubImgMerchSubId] = React.useState(0);

    useEffect(() => {
        const setInfo = async () => {
            setTimeout(() => {
                setUploadInfo('')
            }, 3000)
        };

        setInfo()
    }, [uploadInfo])

    useEffect(() => {
        const getProperty = async () => {
            const res =
                await axios.get(`http://localhost:8082/seller/queryAllMerchandise`, {
                    params: {
                        page: page,
                        rowsPerPage: rowsPerPage
                    }
                });
            setRow(res.data.t);
            setTotalPage(res.data.info);
        };

        getProperty()
    }, [page, rowsPerPage, successInsert, successEdit, searchStatus])

    useEffect(() => {
        const getFolder = () => {
            axios.get(`http://localhost:8082/util/uploadFolder`).then((res) => {
                setUploadFolder(res.data);
            })
        };
        getFolder()
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const addNewFunction = (e) => {
        e.preventDefault();
        if (!addTypeName) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/seller/addNewMerchandise`, qs.stringify({
            merchName: addTypeName,
            merchTypeId: categorySelect['id']
        })).then(function (response) {
            if (response.data) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
                setAddOpen(false);
            }
        });
        setAddTypeName('');
        setCategorySelect([]);
    }

    const inactivateFunction = (Id) => {
        axios.delete(`http://localhost:8082/seller/inactivateMerchandise`, {
            params: {
                merchandiseId: Id,
            }
        }).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
            }
        })
    }

    const getEditFunction = (Id) => {
        axios.get(`http://localhost:8082/seller/getMerchandiseById`, {
            params: {
                merchandiseId: Id,
            }
        }
        ).then(function (response) {
            setEditID(Id);
            setEditName(response.data.t.merch_name);
            setCategorySelect({ 'label': response.data.t.merch_type_name, 'id': response.data.t.merch_type_id })
            setEditStatus(response.data.t.merch_status);
        });
    }

    const editFunction = (e) => {
        e.preventDefault();
        if (!editID || !editName || !categorySelect || !editStatus) {
            alert('Please add all fields!')
            return
        }
        axios.post(`http://localhost:8082/seller/editMerchandiseById`, qs.stringify({
            merchId: editID,
            merchTypeId: categorySelect['id'],
            merchName: editName,
            merchStatus: editStatus,
        })).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                setEditOpen(false);
            }
        });
        setEditID(0);
        setEditName('');
        setEditStatus(0);
        setCategorySelect([]);
    }

    const queryAllCategories = () => {
        axios.get(`http://localhost:8082/seller/queryAllMerchandiseTypeAll`).then(
            (response) => {
                let arr = response.data.t;
                setCategoryRows(arr.map(x => { return { label: x.merchTypeName, id: x.merchTypeId } }));
            }
        )
    };

    const searchFunction = () => {
        if (searchContent === '') {
            setSearchStatus(!searchStatus);
        } else {
            axios.get(`http://localhost:8082/seller/searchMerchandise`, {
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

    const getImageFunction = (Id) => {
        axios.get(`http://localhost:8082/seller/getImageFolder`, {
            params: {
                merchId: Id
            }
        }).then((res) => {
            setImageFolder(uploadFolder + "merchandise/" + res.data);
        });
        axios.get(`http://localhost:8082/seller/getImageSet`, {
            params: {
                merchId: Id
            }
        }).then((res) => {
            setImageSet(res.data);
            setUploadImageMerchId(Id);
        });
    }

    const updateImg = () => {
        var formData = new FormData();
        var inp = document.getElementById("icon-button-file").files[0];
        if (imageSet.length >= 6) {
            setUploadInfo("Max Number of Image is reached !");
            return
        }
        if (!inp) {
            return
        }
        formData.append('img', inp);
        formData.append('merchId', uploadImageMerchId);
        axios({
            url: 'http://localhost:8082/seller/updateMerchandiseImg',
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData
        }).then((res) => {
            setUploadInfo(res.data.info);
            getImageFunction(uploadImageMerchId)
        }
        )
    }

    const deleteImage = (Id) => {
        axios.delete(`http://localhost:8082/seller/removeImage`, {
            params: {
                merchId: uploadImageMerchId,
                imageId: Id
            }
        }).then(function (response) {
            if (response.data === 1) {
                setUploadInfo('Successful!');
                getImageFunction(uploadImageMerchId);
            } else {
                setUploadInfo('Fail!');
            }
        })
    }

    const getDescription = (Id) => {
        axios.get(`http://localhost:8082/seller/selectDescription`, {
            params: {
                merchId: Id,
            }
        }
        ).then(function (response) {
            setEditID(Id);
            setEditDescription(response.data);
        });
    }

    const editDescriptionFunc = () => {
        axios.post(`http://localhost:8082/seller/updateDescription`, qs.stringify({
            merchId: editID,
            description: editDescription,
        })).then(function (response) {
            setEditDescription('');
            setEditID(0);
            setEditDescrOpen(false);
            if (response.data === 1) {
                setSuccessInsert(true);
                setTimeout(() => { setSuccessInsert(false) }, 3000);
            }
        });

    }

    const getDescriptionImg = (Id) => {
        setDescrImgNum([]);
        setDescrImgMerchId(Id);
        axios.get(`http://localhost:8082/seller/getImageFolder`, {
            params: {
                merchId: Id
            }
        }).then((res) => {
            setImageFolder(uploadFolder + "merchandise/" + res.data);
        });
        axios.get(`http://localhost:8082/seller/selectDescriptionImgNum`, {
            params: {
                merchId: Id
            }
        }).then((res) => {
            setDescrImgNum(Array.from({ length: res.data }, (_, i) => i + 1));
        });
    }

    const insertDescriptionImg = () => {
        var formData = new FormData();
        var inp = document.getElementById("contained-button-file").files;
        if (!inp) {
            return
        }
        for (var i = 0; i < inp.length; i++) {
            formData.append('img', inp[i]);
        }
        formData.append('merchId', descrImgMerchId);
        axios({
            url: 'http://localhost:8082/seller/updateDescriptionImg',
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData
        }).then((res) => {
            setUploadInfo(res.data.info);
            getDescriptionImg(descrImgMerchId);
        }
        )

    }

    const deleteDescriptionImg = () => {
        axios.delete(`http://localhost:8082/seller/deleteDescriptionImg`, {
            params: {
                merchId: descrImgMerchId,
            }
        }).then(function (response) {
            if (response.data.t === 1) {
                setUploadInfo('Successful!');
                getDescriptionImg(descrImgMerchId);
            } else {
                setUploadInfo('Fail!');
            }
        })
    }
    const getDetail = (Id) => {
        setDetailMerchId(Id)
        axios.get(`http://localhost:8082/seller/selectMerchandiseSub`, {
            params: {
                merchId: Id,
            }
        }).then((res) => {
            res.data.t.map((x) => {
                var status = x.merchSubStatus;
                if (status === 1)
                    x.merchSubStatus = 'Normal'
                if (status === 0)
                    x.merchSubStatus = 'Inactivate'
            });
            setDetailRows(res.data.t)
        });
    }

    const addSub = () => {

        if (!addMerchSubName || !addMerchSubPrice || !addMerchSubRemaining) {
            alert('Please add all fields!')
            return
        }

        axios({
            url: 'http://localhost:8082/seller/insertMerchandiseSub',
            method: 'post',
            params: {
                merchId: detailMerchId,
                merchSubName: addMerchSubName,
                merchSubPrice: addMerchSubPrice,
                merchSubRemaining: addMerchSubRemaining,
            }
        }
        ).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                getDetail(detailMerchId)
                setAddMerchSubName('')
                setAddMerchSubPrice(0.00)
                setAddMerchSubRemaining(0)
                setDetailAddOpen(false);
            }
        });
    }

    const inactivateSub = (Id) => {
        axios({
            url: 'http://localhost:8082/seller/inactivateSub',
            method: 'post',
            params: {
                merchSubId: Id,
            }
        }
        ).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                getDetail(detailMerchId)
            }
        });
    }

    const reactivateSub = (Id) => {
        axios({
            url: 'http://localhost:8082/seller/reactivateSub',
            method: 'post',
            params: {
                merchSubId: Id,
            }
        }
        ).then(function (response) {
            if (response.data) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                getDetail(detailMerchId)
            }
        })
    }

    const getEditSub = (Id) => {
        setEditMerchSubName('');
        setEditMerchSubPrice(0.00);
        setEditMerchSubOnsalePrice(0.00);
        setEditMerchSubRemaining(0);
        setEditMerchSubOnsaleEndDate('');
        setPromoteDateSelect([]);
        setEditMerchSubOnsaleEndDate('');
        setEditMerchSubId(Id);
        axios({
            url: 'http://localhost:8082/seller/selectSubById',
            method: 'get',
            params: {
                merchSubId: Id,
            }
        }
        ).then(function (response) {
            if (response.data.t) {
                let temp = response.data.t;
                setEditMerchSubName(temp.merchSubName);
                setEditMerchSubPrice(temp.merchSubPrice);
                setEditMerchSubOnsalePrice(temp.merchSubOnsalePrice);
                setEditMerchSubRemaining(temp.merchSubRemaining);
                setEditMerchSubOnsaleEndDate(temp.merchSubOnsaleEndDate);
            }
        })
    }

    const updateEditSub = () => {
        if (!editMerchSubId || !editMerchSubName || !editMerchSubPrice || !editMerchSubRemaining) {
            alert('Please add all fields!')
            return
        }
        axios({
            url: 'http://localhost:8082/seller/updateMerchandiseSub',
            method: 'post',
            params: {
                merchSubId: editMerchSubId,
                merchSubName: editMerchSubName,
                merchSubPrice: editMerchSubPrice,
                merchSubOnsalePrice: editMerchSubOnsalePrice,
                merchSubRemaining: editMerchSubRemaining,
                promotionDate: promoteDateSelect['id']
            }
        }
        ).then(function (response) {
            if (response.data === 1) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
                getDetail(detailMerchId);
                setDetailEditOpen(false);
            }
            setEditMerchSubId(0);
            setEditMerchSubName('');
            setEditMerchSubPrice(0.00);
            setEditMerchSubOnsalePrice(0.00);
            setEditMerchSubRemaining(0);
            setEditMerchSubOnsaleEndDate('');
            setPromoteDateSelect([]);
            setEditMerchSubOnsaleEndDate('');
        })

    }

    const selectSubUrl = (Id) => {
        setSubImgMerchSubId(Id);
        axios.get(`http://localhost:8082/seller/getImageFolder`, {
            params: {
                merchId: detailMerchId
            }
        }).then((res) => {
            setImageFolder(uploadFolder + "merchandise/" + res.data);
        });
        axios({
            url: 'http://localhost:8082/seller/selectSubImageUrl',
            method: 'get',
            params: {
                merchSubId: Id,
            }
        }
        ).then(function (response) {
            setSubImgUrl(ImageFolder + "/" + response.data);
        })
    }

    const deleteSubPhoto = () => {
        
        axios({
            url: 'http://localhost:8082/seller/deleteSubImage',
            method: 'delete',
            params: {
                merchSubId: subImgMerchSubId,
            }
        }
        ).then(function (response) {
            setSubImgUrl(uploadFolder + "merchandise/" + response.data);
            if (response.data === 1) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
            }
        })
    }

    const updateSubPhoto = () => {
        var formData = new FormData();
        var inp = document.getElementById("contained-button-file2").files[0];
        if (!inp) {
            return
        }
        formData.append('img', inp);
        formData.append('merchSubId', subImgMerchSubId);
        axios({
            url: 'http://localhost:8082/seller/updateSubImage',
            method: 'post',
            data:formData
        }
        ).then(function (response) {
            setSubImgUrl(uploadFolder + "merchandise/" + response.data);
            if (response.data === 1) {
                setSuccessEdit(true);
                setTimeout(() => { setSuccessEdit(false) }, 3000);
            }
        })
    }
    return (
        <>
            <h1>Edit My Merchandise
                <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => { handleAddModal(); queryAllCategories(); setCategorySelect([]) }}>
                    <AddIcon />Add Merchandise
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
                            <Autocomplete style={{ marginTop: '1rem' }}
                                value={categorySelect}
                                onChange={(event, newValue) => { setCategorySelect(newValue); }}
                                disablePortal
                                id="selectCountry"
                                options={categoryRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Category" />}
                            />
                            <TextField required fullWidth label="Merchandise Name" value={addTypeName}
                                style={{ marginTop: '1rem' }} onChange={(e) => setAddTypeName(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addNewFunction}>
                                Add New Merchandise Type
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
                            <TextField required fullWidth label="Merchandise Name" value={editName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditName(e.target.value)} />
                            <Autocomplete style={{ marginTop: '1rem' }}
                                value={categorySelect}
                                onChange={(event, newValue) => { setCategorySelect(newValue); }}
                                disablePortal
                                id="selectCountry"
                                options={categoryRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Category" />}
                            />

                            <Typography variant="body2" style={{ marginTop: '2rem' }}>
                                (1 for on sale, -1 for inactive, 0 for off sale, 2 for promotion)
                            </Typography>
                            <TextField required fullWidth label="Status " value={editStatus} style={{ marginTop: '1rem' }}
                                onChange={(e) => setEditStatus(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                                Edit Type
                            </Button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={editDescrOpen}
                onClose={handleEditDescrModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={editDescrOpen}>
                    <Box sx={style}>
                        <form onSubmit={editDescriptionFunc}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Edit Good's Description
                            </Typography>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Multiline"
                                multiline
                                maxRows={20}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editDescriptionFunc}>
                                Edit Description
                            </Button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={imageOpen}
                onClose={handleImageModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={imageOpen}>
                    <Box sx={style2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Merchandise Images
                        </Typography>
                        <Alert variant="outlined" severity="info" >
                            Info: {uploadInfo}
                        </Alert>
                        <Input accept="image/*" id="icon-button-file" type="file" />
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <label htmlFor="icon-button-file">
                                <Input accept="image/*" id="icon-button-file" type="file" />
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                                <Button onClick={updateImg}>Upload</Button>
                            </label>
                        </Stack>
                        <ImageList
                            sx={{ width: 1100, height: 800 }}
                            cols={2} rowHeight={500}
                        >
                            {
                                imageSet.map((x) => {
                                    var temp = Math.random()
                                    return (
                                        <ImageListItem key={x}>
                                            <img
                                                src={`${ImageFolder + "/" + x + '.jpg?temp=' + temp + '&'}?w=164&h=164&fit=crop&auto=format`}
                                                srcSet={`${ImageFolder + "/" + x + '.jpg?temp=' + temp + '&'}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                loading="lazy"
                                                style={{ margin: '2rem', }}
                                                alt=''
                                            />
                                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => { deleteImage(x) }}>
                                                Delete
                                            </Button>
                                        </ImageListItem>

                                    );

                                })
                            }
                        </ImageList>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={editDescrImgOpen}
                onClose={handleEditDescrImgModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={editDescrImgOpen}>
                    <Box sx={style2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Merchandise Images
                        </Typography>
                        <Alert variant="outlined" severity="info" >
                            Info: {uploadInfo}
                        </Alert>

                        <Stack direction="row" alignItems="center" spacing={2} style={{ margin: '1rem' }}>
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" multiple type="file" />
                                <Button variant="contained" component="span">
                                    Select
                                </Button>
                            </label>
                            <Button onClick={insertDescriptionImg}>Upload</Button>
                        </Stack>
                        <Button variant="outlined" color="error" onClick={() => { deleteDescriptionImg() }} style={{ margin: '1rem' }}>
                            <DeleteIcon />Delete All
                        </Button>
                        <ImageList
                            sx={{ width: 1100, height: 800 }}
                            cols={2} rowHeight={500}
                        >
                            {descrImgNum.map((x) => {
                                var temp = Math.random();
                                return (
                                    <ImageListItem key={x}>
                                        <img
                                            src={`${ImageFolder + "/description" + x + '.jpg?temp=' + temp + '&'}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${ImageFolder + "/description" + x + '.jpg?temp=' + temp + '&'}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            loading="lazy"
                                            style={{ margin: '2rem', }}
                                            alt=''
                                        />
                                    </ImageListItem>
                                );
                            })}
                        </ImageList>
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
                            Merchandise Options
                            <Button size='small' variant="outlined" color="success" style={{ marginLeft: '10px' }} onClick={() => { handleDetailAddModal(); }}>
                                <AddIcon />Add Option
                            </Button>
                        </Typography>

                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns2.map((column) => (
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
                                        var statusTemp = false;
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.merch_sub_id}>
                                                {columns2.filter(x => x.id !== 'operation').map((column) => {
                                                    const value = row[column.id];
                                                    if (column.id === 'merchSubStatus' && value === 'Normal')
                                                        statusTemp = true;
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell key='3' align={columns2[7].align}>
                                                    {statusTemp ? <Button variant="outlined" color="error" onClick={() => { inactivateSub(row.merchSubId) }}>
                                                        <DeleteIcon />
                                                    </Button> : <Button variant="outlined" color="success" onClick={() => { reactivateSub(row.merchSubId) }}>
                                                        Reactivate
                                                    </Button>
                                                    }
                                                    <Button variant="outlined" onClick={() => { setDetailEditOpen(true); getEditSub(row.merchSubId); }}
                                                        color="secondary" style={{ marginLeft: '1rem' }} >
                                                        <ChangeCircleIcon />Edit
                                                    </Button>
                                                    <Button variant="outlined" onClick={() => { setDetailImgOpen(true); selectSubUrl(row.merchSubId); }}
                                                        style={{ marginLeft: '1rem' }} >
                                                        <ImageIcon />IMG
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
                        <form onSubmit={addSub}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Add
                            </Typography>
                            <TextField required fullWidth label="Name" value={addMerchSubName}
                                style={{ marginTop: '1rem' }} onChange={(e) => setAddMerchSubName(e.target.value)} />
                            <TextField required fullWidth label="Price" value={addMerchSubPrice}
                                style={{ marginTop: '1rem' }} onChange={(e) => setAddMerchSubPrice(e.target.value)} />
                            <TextField required fullWidth label="# Remaining" value={addMerchSubRemaining}
                                style={{ marginTop: '1rem' }} onChange={(e) => setAddMerchSubRemaining(e.target.value)} />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addSub}>
                                Add New Option
                            </Button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={detailEditOpen}
                onClose={handleDetailEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={detailEditOpen}>
                    <Box sx={style}>
                        <form onSubmit={updateEditSub}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Let's Edit
                            </Typography>
                            <TextField required fullWidth label="Name" value={editMerchSubName}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditMerchSubName(e.target.value)} />
                            <TextField required fullWidth label="Price" value={editMerchSubPrice}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditMerchSubPrice(e.target.value)} />
                            <TextField required fullWidth label="Promotion Price" value={editMerchSubOnsalePrice}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditMerchSubOnsalePrice(e.target.value)} />
                            <TextField required fullWidth label="# Remain" value={editMerchSubRemaining}
                                style={{ marginTop: '2rem' }} onChange={(e) => setEditMerchSubRemaining(e.target.value)} />
                            <TextField disabled fullWidth label="On-sale Promotion" value={editMerchSubOnsaleEndDate}
                                style={{ marginTop: '2rem' }} />
                            <Autocomplete style={{ marginTop: '1rem' }}
                                value={promoteDateSelect}
                                onChange={(event, newValue) => { setPromoteDateSelect(newValue); }}
                                disablePortal
                                id="selectPromotion"
                                options={promotionRows}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Promotion End Date" />}
                            />
                            <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={updateEditSub}>
                                Edit Option
                            </Button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={detailImgOpen}
                onClose={handleDetailImgModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={detailImgOpen}>
                    <Box sx={style3}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Option Image
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2} style={{ margin: '1rem' }}>
                            <Button
                                variant="contained"
                                component="label"
                                >
                                    Select File
                                    <input
                                        type="file"
                                        hidden
                                        id='contained-button-file2'
                             />
                            </Button>
                            <Button onClick={updateSubPhoto}>Upload</Button>
                            <Button variant="outlined" color="error" onClick={() => { deleteSubPhoto() }} style={{ marginLeft: '4rem' }}>
                                <DeleteIcon />Delete Img
                            </Button>
                        </Stack>
                        {
                            <img
                            src={`${subImgUrl}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${subImgUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            loading="lazy"
                            style={{ margin: '2rem' }}
                            alt=''
                            width='800'
                        />
                        }
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.merch_id}>
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
                                            <TableCell key='3' align={columns[3].align}>
                                                <Button variant="outlined" color="error" onClick={() => { inactivateFunction(row.merch_id) }} style={{ marginLeft: '1rem' }} >
                                                    <DeleteIcon />
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.merch_id); queryAllCategories() }}
                                                    color="secondary" style={{ marginLeft: '1rem' }} >
                                                    <ChangeCircleIcon />Edit
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setEditDescrOpen(true); getDescription(row.merch_id); }}
                                                    color="secondary" style={{ marginLeft: '1rem' }} >
                                                    <ChangeCircleIcon />Edit Descr
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setImageOpen(true); getImageFunction(row.merch_id); }}
                                                    style={{ marginLeft: '1rem' }} >
                                                    <ImageIcon />IMG
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setEditDescrImgOpen(true); getDescriptionImg(row.merch_id); }}
                                                    style={{ marginLeft: '1rem' }} >
                                                    <ImageIcon />Descr IMG
                                                </Button>
                                                <Button variant="outlined" onClick={() => { setDetailOpen(true); getDetail(row.merch_id); }}
                                                    style={{ marginLeft: '1rem' }} >
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

export default MerchandiseSeller
