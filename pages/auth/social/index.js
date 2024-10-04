import { useState, useEffect } from 'react';
import has from 'lodash/has';
import { useRouter } from 'next/router';
// import jwt_decode from 'jwt-decode';

// ahooks
import { useMount } from 'ahooks';

// import isEmpty from 'lodash/isEmpty';

// // components
// import PageLoading from '@shared-tools/components/PageLoading/Index';

// utils
import { setAuth } from '@/chatbot-packages/utils/auth.tsx';

let timeoutElm = null;
let isDirecting = false;
export default function HandleUserSocialLogin() {
  const router = useRouter();
  const { query } = router;
  const [isLoginSuccess, setIsLoginSuccess] = useState(null);
  const [redirectPath, setRedirectPath] = useState('');

  useMount(() => {
    timeoutElm = setTimeout(() => {
      router.replace('/?isLoginSuccess=false');
    }, 3000);
  });
  useEffect(() => {
    if (has(query, 'token')) {
      const success = query.token;
      if (success) {
        // dispatch({
        //   type: 'createProjectPageModel/setOriginalCreateProjectData',
        // });
        // dispatch({
        //   type: 'createProjectPageModel/setCreateProjectStep',
        //   payload: {
        //     step: 'uploadProductShot',
        //   },
        // });
        const user = JSON.parse(JSON.stringify(query)); // To avoid delete the user.success affect to the path variables
        // if (user.language) {
        //   const tmp =
        //     user.language[0].toLowerCase() +
        //     user.language.slice(1).replace('_', '-');
        //   setLocale(tmp, true);
        // } else {
        // setLocale('en-US', true);
        // }
        delete user.success;
        setAuth(user);
        window.userId = user.id;
        setIsLoginSuccess(true);

        if (has(query, 'subpath')) {
          const subpath = query.subpath;
          setRedirectPath(subpath);
        }

        window.clearTimeout(timeoutElm);
      } else {
        //   let path = '';
        //   path = `/auth/login?success=false&message=${query.message}`;
        setIsLoginSuccess(false);
        window.clearTimeout(timeoutElm);
      }
    } else {
      // history.replace(createPathCheckQuery({ path: '/auth/login', query }));
      setIsLoginSuccess(false);
      window.clearTimeout(timeoutElm);
    }
  }, [query]);

  useEffect(() => {
    if (isLoginSuccess && !isDirecting) {
      isDirecting = true;
      router.replace(`${redirectPath || '/public'}?isLoginSuccess=${isLoginSuccess}`);
    }
  }, [isLoginSuccess, redirectPath, router]);
  return null;
}
