import { MouseEvent, useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// redux
import { useDispatch, useSelector } from 'react-redux';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// store
import { loginRequest, resetLoginFlag } from 'store/auth/actions';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT - LOGIN ||=============================== //

export default function JWTLogin({ ...others }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useAuth();
  const scriptedRef = useScriptRef();

  const dispatch = useDispatch();
  const { loginLoading: loading, error, errorMsg, isLoggedIn: reduxIsLoggedIn, user: reduxUser } = useSelector((state: any) => state.auth);

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault()!;
  };

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth');

  // Reset login flag on component mount
  useEffect(() => {
    dispatch(resetLoginFlag());
  }, [dispatch]);

  // Handle successful login - use isLoggedIn from useAuth
  useEffect(() => {


    if (isLoggedIn) {

      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate, user]);

  // Debug: Check Redux auth state
  useEffect(() => {

  }, [reduxIsLoggedIn, reduxUser, loading]);

  // Remove the global event listeners that might be causing refresh
  // useEffect(() => {
  //   console.log('🔄 Component mounted - preventing form submissions');
  //
  //   const preventFormSubmit = (e: Event) => {
  //     console.log('🚫 Global form submit prevention triggered');
  //     console.log('🚫 Event target:', e.target);
  //     console.log('🚫 Event type:', e.type);
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return false;
  //   };

  //   const handlePageLoad = () => {
  //     console.log('🔄 Page loaded/refreshed');
  //   };

  //   // Add event listeners to prevent form submission
  //   document.addEventListener('submit', preventFormSubmit, true);
  //   window.addEventListener('load', handlePageLoad);
  //
  //   return () => {
  //     console.log('🔄 Component unmounting - cleaning up event listeners');
  //     document.removeEventListener('submit', preventFormSubmit, true);
  //     window.removeEventListener('load', handlePageLoad);
  //   };
  // }, []);

  return (
    <Formik
      initialValues={{
        email: 'esanad@gmail.com',
        password: 'I4ksb@11782',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string()
          .required('Password is required')
          .test('no-leading-trailing-whitespace', 'Password can not start or end with spaces', (value) => value === value.trim())
          .max(20, 'Password must be less than 20 characters')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {

          const trimmedEmail = values.email.trim();

          // Dispatch login request action

          dispatch(loginRequest({ email: trimmedEmail, password: values.password }));

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
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              autoComplete="email"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              autoComplete="current-password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Keep me logged in"
              />
            </Grid>
            <Grid>
              <Typography
                variant="subtitle1"
                component={Link}
                to={
                  isLoggedIn
                    ? '/pages/forgot-password/forgot-password3'
                    : authParam
                      ? `/forgot-password?auth=${authParam}`
                      : '/forgot-password'
                }
                color="secondary"
                sx={{ textDecoration: 'none' }}
              >
                Forgot Password?
              </Typography>
            </Grid>
          </Grid>

          {/* Debug: Manual navigation test */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {

                navigate('/dashboard');
              }}
            >
              Test Navigation to Dashboard
            </Button>
          </Box>

          {/* Show Redux error message */}
          {error && errorMsg && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{typeof errorMsg === 'string' ? errorMsg : errorMsg?.message || 'An error occurred'}</FormHelperText>
            </Box>
          )}

          {/* Show form validation errors */}
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                color="secondary"
                disabled={loading || isSubmitting}
                fullWidth
                size="large"
                type="button"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                onClick={(e) => {

                  e.preventDefault();
                  e.stopPropagation();

                  handleSubmit();
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}
