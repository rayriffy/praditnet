import { initializeApp, getApp, getApps } from 'firebase/app'

export const createFirebaseInstance = () => {
  const appInstance = !getApps().length
    ? initializeApp({
        apiKey: 'AIzaSyCa_5TRjLALW6SXuw6GIp13UxAEKpZ0dts',
        authDomain: 'praditnet-c7752.firebaseapp.com',
        databaseURL:
          'https://praditnet-c7752-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: 'praditnet-c7752',
        storageBucket: 'praditnet-c7752.appspot.com',
        messagingSenderId: '785511293998',
        appId: '1:785511293998:web:cf374ea80863220b0e2bbf',
        measurementId: 'G-4GPF41H8HV',
      })
    : getApp()

  return appInstance
}
