import "./CourseList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { axiosInstance } from "../../utils/axios";

import EditCourse from './../EditCourse/EditCourse';
import NewCourse from './../NewCourse/NewCourse';
import { Button } from "@material-ui/core";
import { DEFAULT_COURSE_IMAGE } from './../../config'
import { withSnackbar } from "notistack";

const useStyles = makeStyles({

    dataGrid: {
        width: "100%",
        marginTop: '30px'
    },
});

function ProductList(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);

    useEffect(function () {
        async function loadNewMembers() {
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

        loadNewMembers();
    }, []);

    const handleDelete = async (id) => {
        setData(data.filter((item) => item.id !== id));
        try {
            const res = await axiosInstance.delete(`/courses/${id}`);
            console.log(data)
            if (res.status === 200) {
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
        console.log('Button clicked')
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

            {showEditDialog && <EditCourse id={editId} toggle={() => setShowEditDialog(false)} />}
            {showAddDialog && <NewCourse toggle={() => setShowAddDialog(false)} />}


        </div >
    );


}

export default withSnackbar(ProductList);