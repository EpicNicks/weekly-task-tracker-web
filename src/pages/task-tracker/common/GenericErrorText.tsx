import { Typography } from '@mui/material'
import { FormikProps } from 'formik'

export default function GenericErrorText<T>({ formik, fieldName }: { formik: FormikProps<T>, fieldName: keyof typeof formik.values }) {
    return formik.touched[fieldName] && formik.errors[fieldName] && (
        <Typography color="red">{formik.errors[fieldName]?.toString()}</Typography>
    )
}