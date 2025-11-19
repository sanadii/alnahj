import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/actions';
import { forgotPasswordRequest, resetForgotPasswordFlag } from 'store/auth/actions';

// ========================|| JWT - FORGOT PASSWORD ||======================== //

export default function AuthForgotPassword({ link, ...others }: { link?: string }) {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const { forgotPasswordLoading, forgotPasswordSuccess, forgotPasswordMessage } = useSelector((state: any) => state.auth);

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth');

  // Reset forgot password flag on component mount
  useEffect(() => {
    dispatch(resetForgotPasswordFlag());
  }, [dispatch]);

  // Handle forgot password success
  useEffect(() => {
    if (forgotPasswordSuccess && forgotPasswordMessage) {
      dispatch(
        openSnackbar({
          open: true,
          message: forgotPasswordMessage,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      setTimeout(() => {
        navigate(isLoggedIn ? `/pages/check-mail/${link || 'check-mail3'}` : authParam ? `/check-mail?auth=${authParam}` : '/check-mail', {
          replace: true
        });
      }, 1500);
    }
  }, [forgotPasswordSuccess, forgotPasswordMessage, navigate, authParam, isLoggedIn, link, dispatch]);

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const trimmedEmail = values.email.trim();

          // Dispatch forgot password request action
          dispatch(forgotPasswordRequest({ email: trimmedEmail }));

          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err: any) {

          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-forgot">Email Address / Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email Address / Username"
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting || forgotPasswordLoading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
              >
                {forgotPasswordLoading ? 'Sending...' : 'Reset Password'}
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}
