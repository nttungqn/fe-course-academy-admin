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

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px'
    },
});

function CourseList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);

    async function loadCourses() {
        const res = await axiosInstance.get('/courses?limit=999&sort_type=asc');
        if (res.data.courses) {
            let courses = res.data.courses.map((el) => {
                el['course']['category'] = el['category'];
                delete el['category'];
                return el['course'];
            });
            setData(courses);
        }
    }

    useEffect(function () {

        loadCourses();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axiosInstance.delete(`/courses/${id}`);
            if (res.status === 200) {
                setData(data.filter((item) => item.id !== id));
                props.enqueueSnackbar('Successfully deleted course', { variant: 'success' });
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }

        } catch (err) {
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }
    };

    const handleEdit = (id) => {
        setEditId(id);
        setShowEditDialog(true);
    };

    const handleCreate = () => {

        setShowAddDialog(true);
    }

    const columns = [
        { field: "id", headerName: "ID", flex: 0.15 },
        {
            field: "course",
            headerName: "Course",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <div className="courseListItem">
                        <img className="courseListImg" src={params.row.image || DEFAULT_COURSE_IMAGE} alt="" />
                        {params.row.name}
                    </div>
                );
            },
        },
        { field: "price", headerName: "Price", flex: 0.15 },
        {
            field: "category",
            headerName: "Category",
            flex: 0.45,
            renderCell: (params) => {
                return (
                    <div>{params.row.category.name}</div>
                );
            }
        },
        {
            field: "view",
            headerName: "View",
            flex: 0.15,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 0.2,
            renderCell: (params) => {
                return (
                    <>
                        <button className="buttonEdit" variant="contained"
                            onClick={() => handleEdit(params.row.id)}>Edit
                        </button>

                        <button className="buttonDelete" variant="contained"
                            onClick={() => handleDelete(params.row.id)}>Delete
                        </button>
                    </>
                );
            },
        },
    ];

    const handleAddOnClick = async (initialValues, values) => {

        try {
            let data = { image: DEFAULT_COURSE_IMAGE, ...initialValues, ...values, last_update: moment().format('YYYY-MM-DD h:mm:ss') }
            console.log(data);
            const res = await axiosInstance.post(`/courses`, data);
            if (res.status === 200 || res.status === 201) {
                props.enqueueSnackbar('Successfully add course', { variant: 'success' });
                await loadCourses();
            } else {
                props.enqueueSnackbar('Failed done the operation.', { variant: 'error' });
            }
            setShowAddDialog(false);
        } catch (err) {
            console.log(err);
            props.enqueueSnackbar('Failed done the operation', { variant: 'error' });
        }

    }

    const handleEditOnClick = async (values) => {

        try {
            const res = await axiosInstance.put(`/courses/${editId}`, values);
            console.log(res)
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
            <DataGrid className={classes.dataGrid}
                rows={data}
                disableSelectionOnClick
                columns={columns}
                pageSize={8}
                checkboxSelection
                autoHeight={true}
            >

            </DataGrid>

            {showEditDialog && <EditCourse handle={handleEditOnClick} id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewCourse handle={handleAddOnClick} toggle={() => setShowAddDialog(false)} />}

        </div >
    );


}

export default withSnackbar(CourseList);