import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameRouteNames } from './route-names';
import { Text } from 'react-native'
import TableScreen from '../screens/game/TableScreen';
import LobbyScreen from '../screens/game/LobbyScreen';
import UserDetScreen from '../screens/game/UserDetScreen';

const GameStack = createNativeStackNavigator();

const gameroutes = (
    <GameStack.Navigator>
        <GameStack.Screen name={GameRouteNames.LOBBY} component={LobbyScreen} options={{
            headerTitle: (props) => <Text {...props} style={{fontSize: 20}}>Lobby</Text>
        }}/>
        <GameStack.Screen name={GameRouteNames.TABLE} component={TableScreen} options={{
            headerTitle: (props) => <Text {...props}>Table</Text>
        }}/>
        <GameStack.Screen name={GameRouteNames.USER_DETAILS} component={UserDetScreen} options={{
            headerTitle: (props) => <Text {...props}>User Details</Text>
        }}/>
    </GameStack.Navigator>
)

export default gameroutes;

