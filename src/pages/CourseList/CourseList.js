import "./CourseList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/base";

import EditCourse from './../EditCourse/EditCourse';
import NewCourse from './../NewCourse/NewCourse';
import { Button } from "@material-ui/core";
import { DEFAULT_COURSE_IMAGE } from './../../config'
import { withSnackbar } from "notistack";
import moment from "moment";
import CircularIndeterminate from "../../components/CircularIndeterminate/CircularIndeterminate";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px',
    },
});

function CourseList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [loadingBar, setLoadingBar] = useState(false);

    async function loadCourses() {
        setLoadingBar(true);
        const res = await axiosInstance.get('/courses?limit=999&sort_type=asc');
        setLoadingBar(false);
        if (res.data.courses) {
            let courses = res.data.courses.map((el) => {
                el['course']['category_name'] = el['category']['name'];
                el['course']['created_by'] = el['user']['fullname'];
                delete el['category'];
                delete el['user'];
                return el['course'];
            });
            setData(courses);
        }
    }

    useEffect(function () {

        loadCourses();
    }, []);

    const handleEdit = (id) => {
        setEditId(id);
        setShowEditDialog(true);
    };

    const handleCreate = () => {

        setShowAddDialog(true);
    }

    const handleBlock = async (id) => {
        try {
            setLoadingBar(true)
            const res = await axiosInstance.delete(`/courses/${id}`);
            setLoadingBar(false)
            console.log(data)
            if (res.status === 200) {
                // setData(data.filter((item) => item.id !== id));
                await loadCourses();
                props.enqueueSnackbar('Successfully disable course', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }

        } catch (err) {
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }
    };

    const handleUnblock = async (id) => {
        try {
            setLoadingBar(true)
            const res = await axiosInstance.put(`/courses/${id}`, { is_delete: false });
            setLoadingBar(false)
            console.log(data)
            if (res.status === 200) {
                // setData(data.filter((item) => item.id !== id));
                await loadCourses();
                props.enqueueSnackbar('Successfully enable course', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }

        } catch (err) {
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "url", headerName: "Image", flex: 0.15, renderCell: (params) => {
                return (
                    <img className="courseListImg" src={params.row.image !== "null" ? (params.row.image || DEFAULT_COURSE_IMAGE) : DEFAULT_COURSE_IMAGE} alt={params.row.name} />
                );
            },
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0.2,
        },
        { field: "price", headerName: "Price", flex: 0.15, type: "number" },
        {
            field: "created_by",
            headerName: "Created by",
            flex: 0.3,
        },
        {
            field: "category_name",
            headerName: "Category",
            flex: 0.3,
        },
        {
            field: "view",
            headerName: "View",
            flex: 0.15,
            type: "number"
        },
        {
            field: "action",
            headerName: "Action",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.is_delete === 0 ?
                            <button className="buttonEdit" variant="contained"
                                onClick={() => handleEdit(params.row.id)}>Edit
                            </button> : <button className="buttonEdit" variant="contained" disabled
                                onClick={() => handleEdit(params.row.id)}>Edit
                            </button>}

                        {params.row.is_delete === 0
                            ? <button className="buttonDelete" variant="contained"
                                onClick={() => handleBlock(params.row.id)}>Disable
                            </button> : <button className="buttonUnblock" variant="contained"
                                onClick={() => handleUnblock(params.row.id)}>Enable
                            </button>}
                    </>
                );
            },
        },
    ];

    const handleAddOnClick = async (initialValues, values) => {

        try {
            let data = { ...initialValues, ...values, last_update: moment().format('YYYY-MM-DD h:mm:ss') }
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            let fd = new FormData();
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    fd.append(key, data[key]);
                }
            }
            const res = await axiosInstance.post(`/courses`, fd, config);
            if (res.status === 200 || res.status === 201) {
                props.enqueueSnackbar('Successfully add course', { variant: 'success' });
                await loadCourses();
            } else {
                console.log(res)
                props.enqueueSnackbar('Failed done the operation.' + res.toString(), { variant: 'error' });
            }
            setShowAddDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    const handleEditOnClick = async (values) => {

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            let fd = new FormData();
            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    fd.append(key, values[key]);
                }
            }
            const res = await axiosInstance.put(`/courses/${editId}`, fd, config);
            if (res.status === 200 || res.status === 202) {
                props.enqueueSnackbar('Successfully updated course', { variant: 'success' });
                await loadCourses();
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowEditDialog(false);

        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    return (
        <div className="courseList">
            <h1>Course List</h1>
            <Button className='buttonCreate' variant="contained" color="primary" onClick={() => handleCreate()}>
                Create new course
            </Button>
            {loadingBar ? <CircularIndeterminate /> :
                <DataGrid className={classes.dataGrid}
                    rows={data}
                    disableSelectionOnClick
                    columns={columns}
                    pageSize={8}
                    checkboxSelection
                    autoHeight={true}
                >

                </DataGrid>
            }

            {showEditDialog && <EditCourse handle={handleEditOnClick} id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewCourse handle={handleAddOnClick} toggle={() => setShowAddDialog(false)} />}

        </div >
    );


}

export default withSnackbar(CourseList);