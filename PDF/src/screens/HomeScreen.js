// Example to Make PDF in React Native from HTML Text
// https://aboutreact.com/make-pdf-in-react-native-from-html-text/

// Import React
import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  FlatList,
} from 'react-native';

// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {data} from '../model/SampleData';

const App = () => {
  const [filePath, setFilePath] = useState('');

  const [loader, setLoader] = useState(false);

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const getFlatistDataIntoHtml = () => {
    const pdfSource = data.map((item, index) => {
      return `<div style="background-color:${
        index % 2 == 0 ? '#ccc' : 'white'
      };padding:10px;padding-left:10;display:flex;"><p style="font-size:20px;width:50%;">${
        item.name
      }</p><p style="font-size:20px;width:50%;">${item.branch}</p></div>`;
    });
    console.log(pdfSource.toString().replace(/,/g, ''));
    return pdfSource.toString().replace(/,/g, '');
  };

  const createPDF = async () => {
    if (await isPermitted()) {
      console.log('granted permission and creating pdf');
      let options = {
        //Content to print
        html: `<p style="background-color:powderblue;font-size:50px;font-family:courier;text-align:center;padding-top:20px;padding-bottom:20px">Students List <p><div style="display:flex;"><p style="font-size:30px;width:50%;padding-left:10">Name</p><p style="font-size:30px;width:50%;">Department</p></div>${getFlatistDataIntoHtml()}`,
        //File Name
        fileName: 'Sample_pdf_',
        //File directory
        directory: 'docs',
      };
      setLoader(true);
      let file = await RNHTMLtoPDF.convert(options);
      setLoader(false);
      ToastAndroid.show('Pdf saved at : ' + file.filePath, ToastAndroid.LONG);
      console.log(file.filePath);
      setFilePath(file.filePath);
    }
  };

  const rednerListData = () => {
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() => (
            <View>
              <Text style={styles.titleText}>Students List</Text>
              <View
                style={{
                  width: '100%',
                  paddingVertical: 15,
                  flexDirection: 'row',
                }}>
                <Text style={{width: '50%', fontSize: 20, fontWeight: 'bold'}}>
                  Name
                </Text>
                <Text style={{width: '50%', fontSize: 20, fontWeight: 'bold'}}>
                  Department
                </Text>
              </View>
            </View>
          )}
          data={data}
          keyExtractor={item => item.name}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                backgroundColor: index % 2 == 0 ? '#ccc' : 'white',
              }}>
              <Text style={{width: '50%', fontSize: 15}}>{item.name}</Text>
              <Text style={{width: '50%', fontSize: 15}}>{item.branch}</Text>
            </View>
          )}></FlatList>

        <TouchableOpacity onPress={createPDF}>
          <View>
            <Text
              style={{
                borderRadius: 10,
                padding: 20,
                backgroundColor: 'black',
                paddingVertical: 10,
                color: 'white',
              }}>
              Create PDF
            </Text>
          </View>
        </TouchableOpacity>
        {/* <Text style={styles.textStyle}>{filePath}</Text> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loader == false && rednerListData()}
      {loader == true && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>Creating PDF...</Text>

          <ActivityIndicator color="black" size="large"></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    marginTop: 20,
    backgroundColor: 'powderblue',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    fontSize: 18,
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  imageStyle: {
    width: 150,
    height: 150,
    margin: 5,
    resizeMode: 'stretch',
  },
});
