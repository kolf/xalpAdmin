import queryString from 'query-string';
import api from '../core/http';

class PoliceService {
  getAllCamera = async (creds) => {
    try {
      const res = await api.get(
        `sightseer/camera/queryAll?${queryString.stringify(creds)}`,
<<<<<<< HEAD
      );

      return res.data.data;
=======
      );

      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getCameraList = async (query, creds) => {
    try {
      const res = await api.get(
        `sightseer/camera/page/${creds.status}/${
          creds.cameraName
        }?${queryString.stringify(query)}`,
      );
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateCamera = async (creds) => {
    try {
      const res = await api.post(`sightseer/camera/updateOne`, creds);
      return res.data;
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
    } catch (error) {
      return Promise.reject(error);
    }
  };

<<<<<<< HEAD
  getCameraList = async (query, creds) => {
    try {
      const res = await api.get(
        `sightseer/camera/page/${creds.status}/${
          creds.cameraName
        }?${queryString.stringify(query)}`,
=======
  addCamera = async (creds) => {
    try {
      const res = await api.post(`sightseer/camera/saveData`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getDeviceInOutCount = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/InOutCount?${queryString.stringify(creds)}`,
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
      );
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateCamera = async (creds) => {
    try {
      const res = await api.post(`sightseer/camera/updateOne`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

<<<<<<< HEAD
  addCamera = async (creds) => {
    try {
      const res = await api.post(`sightseer/camera/saveData`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getDeviceInOutCount = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/InOutCount?${queryString.stringify(creds)}`,
=======
  getDeviceLogList = async (creds) => {
    try {
      const res = await api.get(
        `api/DeviceLog/InteractionList?${queryString.stringify(creds)}`,
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getDeviceLogList = async (creds) => {
    try {
<<<<<<< HEAD
      const res = await api.get(
        `api/DeviceLog/InteractionList?${queryString.stringify(creds)}`,
      );
      return res.data;
=======
      const res1 = await api.get(`api/Device/HomeList`);

      return [
        ...res1.data.map((item) => ({
          ...item,
          ...item.device,
          deviceType: 1,
        }))
      ];
>>>>>>> e8ee3f10bb487afce9255239d636eaff39d987cb
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getDeviceMapList = async (creds) => {
    try {
      const res1 = await api.get(`api/Device/HomeList`);
      const res2 = await api.get(
        `sightseer/camera/queryAll?${queryString.stringify(creds)}`,
      );

      return [
        ...res1.data.map((item) => ({
          ...item,
          ...item.device,
          deviceType: 1,
        })),
        ...res2.data.data
          .filter((item) => item.userStatus === '0')
          .map((item) => ({ ...item, deviceType: 2 })),
      ];
    } catch (error) {
      return Promise.resolve([]);
    }
  };

  getDeviceList = async (creds) => {
    try {
      const res = await api.get(
        `api/Device/List?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  updateDevice = async (creds) => {
    try {
      const res = await api.put(`api/Device/${creds.id}`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  addDevice = async (creds) => {
    try {
      const res = await api.post(`api/Device`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deleteDevice = async (creds) => {
    try {
      const res = await api.delete(
        `api/Device?${queryString.stringify(creds)}`,
      );
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  switchCertCheck = async (creds) => {
    try {
      const res = await api.post(`api/Device/SwitchCertCheck`, creds);
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new PoliceService();
