import React from 'react';
import { View } from 'react-native';
import * as Icons from 'lucide-react-native';
const App = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Icons.Trash2 color="#aaa" size={120} />
    </View>
  );
};

export default App;
