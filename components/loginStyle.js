import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#c7fcd0',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 21,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'green',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    width: '100%',
    height: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor:'whitesmoke',
    width:'100%',
    textAlign:'center',
    paddingLeft: 15,
    paddingTop: 5,
    color:'green'

  },
  errorText: {
    color: 'brown',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default styles;
