Current user: UserImpl {providerId: 'firebase', proactiveRefresh: ProactiveRefresh, reloadUserInfo: {…}, reloadListener: null, uid: '4QqqU1WUUnaz6wNjrnLPAXYvivl2', …}
UserManagementPage.js:26 Current user: UserImpl {providerId: 'firebase', proactiveRefresh: ProactiveRefresh, reloadUserInfo: {…}, reloadListener: null, uid: '4QqqU1WUUnaz6wNjrnLPAXYvivl2', …}
UserManagementPage.js:26 Current user: UserImpl {providerId: 'firebase', proactiveRefresh: ProactiveRefresh, reloadUserInfo: {…}, reloadListener: null, uid: '4QqqU1WUUnaz6wNjrnLPAXYvivl2', …}
UserManagementPage.js:26 Current user: UserImpl {providerId: 'firebase', proactiveRefresh: ProactiveRefresh, reloadUserInfo: {…}, reloadListener: null, uid: '4QqqU1WUUnaz6wNjrnLPAXYvivl2', …}
AddUserForm.js:159 🔍 Creating user with data: {email: '3bdudvdlhs@gmail.com', displayName: 'Abdulhafeez s', adminType: null, role: 'مشاهد'}
userService.js:69 🔍 Auth check in service: {currentUser: UserImpl, uid: '4QqqU1WUUnaz6wNjrnLPAXYvivl2'}
userService.js:82 ✅ Token refreshed successfully
userService.js:91 🔍 Calling Cloud Function with profile: {email: '3bdudvdlhs@gmail.com', adminType: null, role: 'مشاهد'}
userService.js:101 ✅ Simple function call successful: {success: true, message: 'Simple test successful', timestamp: '2025-07-09T20:11:51.343Z'}
userService.js:106  POST https://us-central1-shoply-31172.cloudfunctions.net/createUserByAdmin 401 (Unauthorized)
postJSON @ service.ts:222
callAtURL @ service.ts:298
await in callAtURL
call @ service.ts:261
(anonymous) @ service.ts:186
createUserByAdminCloud @ userService.js:106
await in createUserByAdminCloud
onSubmit @ AddUserForm.js:166
(anonymous) @ createFormControl.ts:1255
await in (anonymous)
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430Understand this error
userService.js:110 Cloud Function error: FirebaseError: You must be signed in.
overrideMethod @ hook.js:608
createUserByAdminCloud @ userService.js:110
await in createUserByAdminCloud
onSubmit @ AddUserForm.js:166
(anonymous) @ createFormControl.ts:1255
await in (anonymous)
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430Understand this error
AddUserForm.js:192 ❌ Failed to create user: FirebaseError: You must be signed in.
overrideMethod @ hook.js:608
onSubmit @ AddUserForm.js:192
await in onSubmit
(anonymous) @ createFormControl.ts:1255
await in (anonymous)
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430Understand this error